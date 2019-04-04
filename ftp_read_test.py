from ftplib import FTP
from queue import Queue
import threading


class Node:

    def __init__(self, name: str, parent, depth: int):
        self.name = name
        self.parent = parent
        self.child = set()
        self.path = ""
        self.depth = depth

    def __str__(self):
        return self.name


class FtpReader:

    def __init__(self, name=None, server="192.168.1.101", port=21, username="spsi001", password="spsi"):
        self.name = name
        self.server = server
        self.port = port
        self.username = username
        self.password = password
        self.ftp = FTP()
        self.root = Node(name="root", parent=None, depth=0)
        self.root.path = "/"
        self.ftp_tree = {self.root}
        self.init()

    def init(self):
        self.ftp.set_debuglevel(2)
        self.ftp.connect(self.server, self.port)
        self.ftp.login(user=self.username, passwd=self.password)
        root = self.root
        ftp_tree = self.ftp_tree
        ftp_queue = Queue()
        ftp_queue.put(root)

        while not ftp_queue.empty():
            current = ftp_queue.get()
            if current.depth >= 2: continue
            file = self.ftp.nlst(current.path)
            for dir in file[2:]:
                node = Node(name=dir, parent=current,  depth=current.depth+1)
                node.path = node.parent.path + "/" + node.name
                current.child.add(node)
                ftp_tree.add(node)
                ftp_queue.put(node)

    def find_node(self, path):
        for i in self.ftp_tree:
            if i.path == path:
                return i
        return None

    def find_child(self, path):
        node = self.find_node(path)
        result = []
        if node is not None:
            for child in node.child:
                result.append(child.name)
        else:
            # parent_path: //Videos/SN/data_day/001/dav/data_hour
            parent = self.find_node(path="/".join(path.split("/")[:4]))
            result = self.add_child_by_path(path=path, parent=parent)
        return result

    def add_child_by_path(self, path, parent):
        files = self.ftp.nlst(path)
        for file in files[2:]:
            node = Node(name=file, parent=parent, depth=parent.depth + 1)
            node.path = node.parent.path + "/" + node.name
            parent.child.add(node)
            self.ftp_tree.add(node)
        return files[2:]

    def find_path_by_name(self, name):
        for i in self.ftp_tree:
            if i.name == name:
                # print(i.path)
                return i.path

    def find(self, name):
        path = self.find_path_by_name(name)
        result = self.find_child(path)
        return result

    def get_information(self):
        return {"server": self.server, "port": self.port,
                "username": self.username, "password": self.password}


if __name__ == "__main__":
    myFtpReader = FtpReader(server="192.168.1.182")
    print(myFtpReader.ftp_tree)
    #result = myFtpReader.DownLoadFile("D:/biggerphone/ftp测试/1.txt", "ftp://spsi001:spsi@192.168.1.101//Videos/4F02578PAG77CB2/2018-12-19/001/dav/00/test/test.txt")
    #print(result)
    # myFtpReader.play_video_by_path("ftp://spsi001:spsi@192.168.1.101//Videos/4F02578PAG77CB2/2018-12-19/001/dav/00/test.mp4")



    # def DownLoadFile(self, LocalFile, RemoteFile):  # 下载单个文件
    #     file_handler = open(LocalFile, 'wb')
    #     print(file_handler)
    #     # self.ftp.retrbinary("RETR %s" % (RemoteFile), file_handler.write)#接收服务器上文件并写入本地文件
    #     self.ftp.retrbinary('RETR ' + RemoteFile, file_handler.write)
    #     file_handler.close()