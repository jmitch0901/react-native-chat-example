import React, { Component } from 'react'
import { View, Text, Button, ListView, TextInput, StyleSheet } from 'react-native'

import IO from 'socket.io-client/dist/socket.io'
const SERVER_IP = 'http://192.168.1.107:8080';


class App extends Component {

  socket = null
  state = { message: '', inboundMessages: [] }

  constructor() {
    super()
    this.socket = IO(SERVER_IP)
    this.socket.on('message', this._onMessage.bind(this))
  }

  _onMessage(data) {
    if(this.socket === null) {
      console.log('SOCKET IS NULL!')
      return
    }
    this.setState({ inboundMessages: [ ...this.state.inboundMessages, data.message ] })
  }

  _onSendMessage() {
    if(this.socket === null) {
      console.log('SOCKET IS NULL WHILE SENDING!')
      return
    }

    const { message } = this.state

    if(message === null || message === '' || message.length === 0) {
      console.log('MESSAGE TO SEND IS BLANK!', message)
      return
    }

    this.socket.emit('message', {message})
    this.setState({ message: '' })

  }

  _renderRow(text) {
    return <Text style={ styles.messageText }>{ text }</Text>
  }

  render() {

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    return (
      <View style={ styles.container }>
        <ListView
          dataSource={ ds.cloneWithRows(this.state.inboundMessages) }
          renderRow={ this._renderRow }
          enableEmptySections
          renderSeparator={(secID, rowID) => <View key={rowID} style={styles.separator} />}
          style={ styles.listView }
        />
        <TextInput
          style={ styles.textInput }
          onChangeText={ message => this.setState({ message }) }
          value={ this.state.message }
         />
         <Button
           onPress={ this._onSendMessage.bind(this) }
           title="Send Message"
           color="purple"
         />
      </View>
    )
  }


}

const styles = {
  container: {
    flex: 1,
    paddingTop: 15
  },
  listView: {
    flex: 5
  },
  textInput: {
    flex: 0,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray'
  },
  messageText: {
    fontSize: 24,
    padding: 8,
    alignItems: 'center'
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  }
}

export default App
