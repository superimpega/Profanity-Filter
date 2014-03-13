if (autoModerator !== undefined)
  autoModerator.close()

String.prototype.equalsIgnoreCase     = function(other)    { return typeof other !== 'string' ? false : this.toLowerCase() === other.toLowerCase(); };
var autoModeratorModel = require('app/base/Class').extend({
  version: "1.0.3",
	bannedWords: [
		'fan me',
		'come to my room'
		'come to the room'
		'is now your fan',
		'fan y fan',
		'fan to fan',
		'plz dar 4fan',
		'fan4fan',
		'Fan mane',
		'plz fan',
		'pls fan',
		'fan fan fan',
		'join my room',
		'f.a.n',
		'fa n',
		'f a n',
		'f an',
		'fa n',
		'plug.dj/',
		'http://plug.dj'
		
		
		
		

               
	],
	mutedUsers: [],
	init: function() {
		this.proxy = {
			chat:        $.proxy(this.onChat,          this),
			chatCommand: $.proxy(this.onChatCommand,   this),
		}
		API.on(API.CHAT,          this.proxy.chat);
		API.on(API.CHAT_COMMAND,  this.proxy.chatCommand);
		console.log('Automoderator' + this.version + ' now running!')
		API.sendChat('')
	},
	close: function() {
		API.off(API.CHAT,          this.proxy.onChat);
		API.off(API.CHAT_COMMAND,  this.proxy.onChatCommand);
		console.log('AutoModerator version ' + this.version + ' now stopped!')
	},
	onChat:function(data) {
		for (var i in this.bannedWords) {
			var message = data.message.toLowerCase();
			if (message.indexOf(this.bannedWords[i].toLowerCase()) > -1)
				API.moderateDeleteChat(data.chatID)
		};
		if (this.mutedUsers.indexOf(data.fromID) > -1)
			API.moderateDeleteChat(data.chatID);
	},
	onChatCommand: function(value) {
		if (value.indexOf('/banword') === 0) {
			var a = value.substr(8)
			if (this.bannedWords.indexOf(a) < 0) {
				this.bannedWords.push(a)
				API.chatLog(a + ' added to banned words')
			} else {
				this.bannedWords.splice(this.bannedWords.indexOf(a),1)
				API.chatLog(a + ' removed from banned words')
			}
		}
		if (value.indexOf('/mute') === 0) {
			var user = this.getUserID(value.substr(5))
			if (user === null) API.chatLog('user not found!')
			else {
				this.mutedUsers.push(user.id)
				API.chatLog(user.username + ' added to muted users list')
			}
		}
		if (value.indexOf('/unmute') === 0) {
			var user = this.getUserID(value.substr(7))
			if (user === null) API.chatLog('user not found!')
			else if (this.mutedUsers.indexOf(user.id) > -1) {
				this.mutedUsers.splice(this.mutedUsers.indexOf(user.id), 1);
				API.chatLog(user.username + ' removed from muted users list')
			}
		}
	},
	getUserID: function(data) {
    	data = data.trim();
        if (data.substr(0,1) === '@')
            data = data.substr(1);
            var users = API.getUsers();
            for (var i in users) {
                if (users[i].username.equalsIgnoreCase(data) || users[i].id.equalsIgnoreCase(data))
                    return users[i];
            }
            return null;
        }
});
var autoModerator = new autoModeratorModel();
