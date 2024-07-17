
const socket = io.connect(window.location.hostname);
// const socket = io.connect('https://sharma-k-msgit.onrender.com/')
const form = document.getElementById('send-container');
const input = document.getElementById('input');
const messageContainer = document.querySelector('.msgbox');


class chatEngine{
    constructor(msgbox, user)
    {
        this.msgbox= document.getElementById(msgbox);
        this.user_name=user;
 
        // this.socket = io.connect('https://sharma-k-msgit.onrender.com/');
        this.socket = io.connect('http://localhost:5000');
        if(this.user_name){
            this.connectionHandler();
        }
    }
    
    connectionHandler(){
        let self = this;
        this.socket.on('connect', function(){
            // console.log('connection established using sockets...!');

            self.socket.emit('join_room', {
                cuser : self.user_name,
                chatroom: 'msgroom'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined', data);
            })
        });

        // const sendb = document.getElementById('send-msg');
      
        $('#send-msg').click(function(){
            // console.log('clicked');
            const msg = document.getElementById('inp').value;
            //  let msg = $('#inp').val();
            if(msg!=''){
                self.socket.emit('send_message', {
                 message: msg,
                 user_name: self.user_name,
                 chatroom: 'msgroom'
                });
            }
        });


        self.socket.on('receive_message', function(data){
            // console.log('message recieved', data.message);
            const con = document.getElementById('msgbox');
            const msg = document.getElementById('inp');
            let messageElement = document.createElement('div');
            let messagetype = 'right';
            if(data.user_name!=self.user_name){
                messagetype = 'left';
              messageElement.classList.add(messagetype);
            }
            else{
                messageElement.classList.add(messagetype);
            }

            messageElement.innerText = data.message;
            con.append(messageElement);
            msg.value = "";
        })

    }  
}

