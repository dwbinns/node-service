#!/bin/sh
version="$1"
name="$2"
user="${3:-$USER}"
node="node-${version}-linux-x64"
if ! [ -d "$node" ]; then
    curl "https://nodejs.org/dist/${version}/${node}.tar.xz" | tar xJ
    ln "${node}/bin/node" node
fi
shift 3
sudo tee /etc/systemd/system/"${name}.service" <<EOF
[Unit]
Description=$name

[Service]
ExecStart=$PWD/node . service $@
WorkingDirectory=$PWD
User=$user
StandardOutput=inherit
StandardError=inherit
Restart=always

[Install]
WantedBy=multi-user.target
EOF
sudo chmod u=rw,og=r /etc/systemd/system/"${name}.service"
sudo systemctl enable "${name}.service"
