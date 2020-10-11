grpc_tools_node_protoc --js_out=import_style=commonjs,binary:. --grpc_out=. ./rpc/actions.proto
protoc --ts_out=./rpc -I ./rpc ./rpc/actions.proto
