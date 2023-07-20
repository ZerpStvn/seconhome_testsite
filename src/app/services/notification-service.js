import {message} from 'antd';
export function notifyUser(messageText,type) {
	message[type]({
		content:
		messageText
	  });
}
