import { Injectable } from '@angular/core';
import { commonErrMessageIfMsgNotFound, messageList } from 'src/app/shared/messages';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  /**
   * @author Amit Malik
   * @description this methods is used to get the message with other fields
   * @param key key to get message from the static list of messages 
   */
  getMessage(key) {
    //console.log("key1 : ", key);
    let msgObj = null;
    messageList.filter(e => {
      if (e.messageKey == key) {
        //console.log("e : ", e);
        return msgObj = e;
      }
    });
    if (msgObj == null) {
      msgObj = JSON.parse(JSON.stringify(commonErrMessageIfMsgNotFound));
      if (key && key.split(" ").length > 2) {
        msgObj.description = key;
      }
    }
    return msgObj
  }
}
