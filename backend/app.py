
import socket  # module needed to use sockets
import os       #neccesarry to access env variables



# We initialize a socket, but it expects some arguments
# We'll pass family and type (family -> IP = ipv4 in this case but can be 6) and (type = which can be TCP or UDP, in this case will be TCP)
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# Settings to change default settings of sockets
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)  # 1 = on , 0 = off

# "0.0.0.0" from any device , then we have the port
server_socket.bind((os.getenv("SERVER_HOST", "False"), os.getenv("SERVER_PORT", "False")))
server_socket.listen(5)
print(f"Listening on {server_socket.getsockname()}")

# client_socket ->  used to send and receive data from connections just accepted
while True:
    client_socket, client_address = server_socket.accept()
    # max amount of data in bytes
    # since bytes are return, then I convert then to string using decode
    # what I get is info about the request made
    request = client_socket.recv(1500).decode()
    print(f"Received: {request}")
    headers = request.split('\n')
    first_header_componentes = headers[0].split()

    http_method = first_header_componentes[0]
    path = first_header_componentes[1]
    print(f"HTTP method: {http_method} - path: {path}")

    response = ""

    if http_method == "GET":
        if path == '/':
            file = open('./templates/index.html')
            content = file.read()
            file.close()

            response = 'HTTP/1.1 200 OK\n\n' + content
    else:
        response = 'HTTP/1.1 405 Method Not Allowed\n\n Allowed: GET'

    client_socket.sendall(response.encode())
    client_socket.close()
