import socket
import optparse
import re
import threading
import sys
import parser


def anlyze_host(target_host):
    try:
        pattern = re.compile(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}')
        match = pattern.match(target_host)
        if match:
            return (match.group())
        else:
            try:
                target_host = socket.gethostbyname(target_host)
                return (target_host)
            except Exception as err:
                print('地址解析错误：', err)
                exit(0)
    except Exception as err:
        print('请注意错误1：', sys.exc_info()[0], err)
        print(parser.usage)
        exit(0)


def anlyze_port(target_port):
    try:
        pattern = re.compile(r'(\d+)-(\d+)')
        match = pattern.match(target_port)
        if match:
            start_port = int(match.group(1))
            end_port = int(match.group(2))
            return ([x for x in range(start_port, end_port + 1)])
        else:
            return ([int(x) for x in target_port.split(',')])
    except Exception as err:
        print('请注意错误2：', sys.exc_info()[0], err)
        print(parser.usage)
        exit(0)


def scanner(target_host, target_port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(0.1)
    try:
        s.connect((target_host, target_port))
        # s.sendall(b'hello\r\n\r\n')
        # message = s.recv(100)
        # if message:
        print('[+]%s的%3s端口:打开' % (target_host, target_port))  # 若可以建立连接，表示此端口是打开的
        # print(' %s' % message.decode('utf-8'))
        return True
    except socket.timeout:
        # print('[-]%s的%3s端口:关闭' % (target_host, target_port))  # 如果连接超时，表示此端口关闭
        return False
    except Exception as err:
        # print('请注意错误3:', sys.exc_info()[0], err)
        return False


def main():
    usage = 'Usage:%prog -h <host> -p <port>'
    parser = optparse.OptionParser(usage, version='%prog v1.0')
    parser.add_option('--host', dest='target_host', type='string',
                      help='需要扫描的主机,域名或IP')
    parser.add_option('--port', dest='target_port', type='string',
                      help='需要扫描的主机端口，支持1-100或21,53,80两种形式')
    (options, args) = parser.parse_args()
    if options.target_host == None or options.target_port == None:
        print(parser.usage)
        exit(0)
    else:
        target_host = options.target_host
        target_port = options.target_port

    target_host = anlyze_host(target_host)
    target_port = anlyze_port(target_port)
    for port in target_port:
        t = threading.Thread(target=scanner, args=(target_host, port))  # 多线程扫描端口
        t.start()


if __name__ == '__main__':
    main()
