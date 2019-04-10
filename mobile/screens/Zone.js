import * as React from 'react';
import { Text, View, StyleSheet, Alert, AsyncStorage  } from 'react-native';
import { Button as ButtonReact } from 'react-native';
import { Constants } from 'expo';

import { Container, Header, Left, Body, Right, Button, Icon, Title, List, ListItem, Content, Item, Label, Input, Spinner, Card, CardItem } from 'native-base';
import Modal from "react-native-modal";

const STORE_NODE_ID = '__NODE_ID'

export default class Zone extends React.Component {
  
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });
    
  constructor(props) {
    super(props);
    this.state = {
      listZone: [],
      isVisible: false,
      zoneName: '',
      nodeName: '',
      nodeAlias: '', 
      storeNodeId: [],
      isStoreGetIt: false,
      controlOnColor: 'gray',
      controlOffColor: 'gray',
      controlAutoColor: 'gray', 
      controlState: 'f',
    };

    this.deleteList = this.deleteList.bind(this)

  }

  componentDidMount() { 
    this.bootstrapAsync()
  }

  componentWillUnmount() {
    console.log('willunmount')
    this.netpie()
  }

  bootstrapAsync = async () => {
    const { navigation } = this.props;
    const zoneName = navigation.getParam('zoneName');
    this.setState({zoneName: zoneName})

    let zoneFile = await AsyncStorage.getItem(zoneName)
    let zone = JSON.parse(zoneFile);
    console.log('zone ->', zone)
    if( zone.length ) { 
      this.setState({
        listZone: zone
      } )
      this.setState({
        controlState: zone[0].state
      } )
      console.log('bootstrapAsync listZone->', this.state.listZone, this.state.controlState) 
      if(zone[0].state == 'o') {
        this.setState({controlOnColor: 'blue'})
      } else if(zone[0].state == 'a') {
        this.setState({controlAutoColor: 'blue'})
      } else {
        this.setState({controlOffColor: 'blue'})
      }
    } 
    this.setState({
      isStoreGetIt: true
    })
 
    let storeNodeIdFile = await AsyncStorage.getItem(STORE_NODE_ID)
    let storeNodeId = JSON.parse(storeNodeIdFile);
    if( storeNodeId ) {
      this.setState({
        storeNodeId: storeNodeId
      })
      console.log('bootstrapAsync storeNodeId ->', this.state.storeNodeId) 
    } 
  }

  saveZone = () => {
    // let zoneNameIndex = this.state.storeNodeId.indexOf(this.state.nodeName)    
    // let zoneNameIndex = this.state.storeNodeId.findIndex(x => x.id === this.state.nodeName);
    let zoneNameIndex = this.state.storeNodeId.map(function (obj) { return obj.id; }).indexOf(this.state.nodeName);
    console.log('==============', this.state.storeNodeId, this.state.nodeName, zoneNameIndex) 
    if(zoneNameIndex >= 0) {
      Alert.alert(
        'Alert!',
        'Node id Exist',
        [                        
          {text: 'OK', },
        ],
        {cancelable: false},
      )
    } else if(this.state.nodeName == '') {
      Alert.alert(
        'Alert!',
        'Please Enter Node id',
        [                        
          {text: 'OK', },
        ],
        {cancelable: false},
      )
    } else {
      console.log(this.state.nodeName) 
      this.setState({isVisible: false}) 

      let state = this.state.controlState
      if(this.state.listZone.length) {
        state = this.state.listZone[0].state
      }

      this.setState({ listZone: [...this.state.listZone, 
        {alias: this.state.nodeAlias, id: this.state.nodeName, state: state}
      ] },
        async () => {
          console.log('It was saved successfully ->', this.state.listZone)
          await AsyncStorage.setItem(this.state.zoneName, JSON.stringify(this.state.listZone) )
          .then( ()=>{
              console.log('It was saved successfully', this.state.zoneName)
          } )
          .catch( ()=>{
              console.log('There was an error saving the product')
          } )
    
  
        } 
      )  
      
      this.setState({ storeNodeId: [...this.state.storeNodeId, { alias: this.state.nodeAlias, id: this.state.nodeName, state: state } ]},
        async () => {
          await AsyncStorage.setItem(STORE_NODE_ID, JSON.stringify(this.state.storeNodeId) )
            .then( ()=>{
                console.log('saved saveStoreNodeId ->', this.state.storeNodeId)
            } )
            .catch( ()=>{
                console.log('error saveStoreNodeId')
            } )
        } 
      )  

    }    
      
  }

  removeStoreNodeId = (id) => {
    // console.log('removeStoreNodeId value->', value)
    let array = this.state.storeNodeId.filter((item) => {
      return item.id !== id
    });
    this.setState({ storeNodeId: array },
      AsyncStorage.setItem(STORE_NODE_ID, JSON.stringify(this.state.storeNodeId) )
        .then( ()=>{
            console.log('saved saveStoreNodeId ->', this.state.storeNodeId)
        } )
        .catch( ()=>{
            console.log('error saveStoreNodeId')
        } )
    )
  }
 
  control = (button) => {
    console.log('control ->', button)
    this.setState({controlOnColor: 'gray'})
    this.setState({controlOffColor: 'gray'})
    this.setState({controlAutoColor: 'gray'})
    switch(button) {
      case 'on':
        this.setState({controlOnColor: 'blue'})
        this.setState({controlState: 'o'}, this.updateControlState)
        break
      case 'off':
        this.setState({controlOffColor: 'blue'})
        this.setState({controlState: 'f'}, this.updateControlState)
        break
      case 'auto':
        this.setState({controlAutoColor: 'blue'})
        this.setState({controlState: 'a'}, this.updateControlState)
        break
    }
    
  }

  updateControlState = () => {
    let nodeId = []
    let updateListZone = this.state.listZone.map((y) => {
      y.state = this.state.controlState
      nodeId.push(y.id)
      return ( y );
    })
    let updateStoreNodeId = this.state.storeNodeId.map((y) => {
      let index = nodeId.indexOf(y.id) 
      if( index >=0 ) {
        y.state = this.state.controlState
      }
      return ( y );
    })   
    
    AsyncStorage.setItem(STORE_NODE_ID, JSON.stringify(this.state.storeNodeId) )
    AsyncStorage.setItem(this.state.zoneName, JSON.stringify(this.state.listZone) )

    let sendNodeState = [] 
    this.state.storeNodeId.map((y) => {
      sendNodeState.push(y.id)
      sendNodeState.push(y.state)
      return ( y );
    })   
    let req = JSON.stringify(sendNodeState ).split('"').join('')

    let res = this.netpiePublish(req)
    console.log('netpiePublish ->', res)
  }

  netpiePublish = async (req) => {
    try {
      let response = await fetch( 'https://api.netpie.io/topic/xbeeDimmer/chat?retain&auth=Smi2ZlBCKAER6Nh:ITGZ4gjkz4nUxguqyu5Yjx33F',
        {
          method: 'PUT',
          // headers: {
          //   Accept: 'application/json',
          //   'Content-Type': 'application/json',
          // },
          body: req
        })
      let responseJson = await response.json();
      return responseJson.movies;
    } catch (error) {
      console.error(error);
    }
  }

  deleteList = (id) => {
    console.log('deleteList')
    Alert.alert(
      'Delete node id?',
      id,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK', 
          onPress: () => { 
            let array = this.state.listZone.filter((item) => {
              return item.id !== id
            });
            console.log('OK Pressed', id, array); 
            this.setState( {listZone: array} ,
              async () => {
                await AsyncStorage.setItem(this.state.zoneName, JSON.stringify(this.state.listZone) )
                .then( ()=>{
                    console.log('delete, It was saved successfully')
                } )
                .catch( ()=>{
                    console.log('delete, There was an error saving the product')
                } )
        
              } 
            ) 

            let array1 = this.state.storeNodeId.filter((item) => {
              return item.id !== id
            });
            this.setState({ storeNodeId: array1 },
              async () => {
                await AsyncStorage.setItem(STORE_NODE_ID, JSON.stringify(this.state.storeNodeId) )
                  .then( ()=>{
                      console.log('saved saveStoreNodeId ->', this.state.storeNodeId)
                  } )
                  .catch( ()=>{
                      console.log('error saveStoreNodeId')
                  } )
              }
            )
          }
        },
      ],
      {cancelable: false},
    )

  }
 
  render() {

    modalButtonPress = (value) => {
      console.log(value)
    }

    return (
      <Container style={styles.paddingStatusBar} >
        <Header>
          <Left >
            <Button transparent onPress={() => { this.props.navigation.addListener; this.props.navigation.goBack()} }>
            {/* navigate('Home')}> */}
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body style={{ marginLeft: 1 }} >
            <Title>{this.state.zoneName}</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='add' style={{ fontSize: 40,}} onPress={ () => { 
                this.setState({ isVisible: true }) 
                this.setState({ nodeName: '' })
              }} />
            </Button>
          </Right>
        </Header>
        
        <Content >

          { (this.state.listZone.length > 0)  ? 
            <Card>
              <CardItem>
                <Body style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                  <View style={{ marginLeft: 20, marginRight: 20,}}>
                    <ButtonReact title="on" onPress={(text) => { this.control('on') } } color={ this.state.controlOnColor } style={{ fontSize: 40,}} />
                  </View>
                  <View style={{ marginLeft: 20, marginRight: 20,}}>
                    <ButtonReact title="auto" onPress={() => { this.control('auto') } } color={ this.state.controlAutoColor } style={{ fontSize: 40,}} />
                  </View>
                  <View style={{ marginLeft: 20, marginRight: 20,}}>
                    <ButtonReact title="off" onPress={() => { this.control('off') } } color={ this.state.controlOffColor } style={{ fontSize: 40,}} />
                  </View>
                </Body>
              </CardItem>
            </Card>
            : null
          }

          <List 
            dataArray={this.state.listZone}             
            renderRow={ (item) => (
              <ListItem  >
                <Left >
                  <Text >{item.id}</Text>                  
                </Left>
                <Body style={{flex: 1}} >
                  <Text>{item.alias}</Text>
                </Body>
                <Right>
                  <Icon 
                    name="md-remove-circle" 
                    style={{color: 'red', fontSize: 35, }}
                    onPress={ () => {this.deleteList(item.id) } }       
                  />
                </Right>
              </ListItem>
            )}
          /> 

          
          <Modal 
            isVisible={this.state.isVisible}
          >
            <View style={styles.modalContent} >
              <Item floatingLabel last style={{paddingTop:10}}> 
                <Label>Alias</Label>
                <Input 
                  onChangeText={(text)=>{ this.setState({nodeAlias: text})}}
              
                />
              </Item>
              <Item floatingLabel last style={{paddingTop:10}}>
                <Label>Node ID</Label>
                <Input 
                  onChangeText={(text)=>{ this.setState({nodeName: text})}}
                  keyboardType="number-pad"
                />
              </Item>
              <View style={styles.modalContentButton} >
                <View style={styles.modalContentButton}>
                  <ButtonReact title="Cancel" onPress={() => { this.setState({isVisible: false}) } } color={'gray'} />
                </View>
                <View style={styles.modalContentButton}>
                  <ButtonReact 
                    title="Save" 
                    onPress={this.saveZone}
                  />
                </View>
              </View>

            </View>
          </Modal>
        

        </Content>
        
        { (this.state.listZone.length == 0 && this.state.isStoreGetIt)  ? 
          <Content contentContainerStyle={styles.container} >
            <Icon 
              name="md-add-circle" 
              style={{color: 'blue', fontSize: 50, marginRight: 5}}
              onPress={ () => { 
                this.setState({ isVisible: true }) 
                this.setState({ nodeName: '' })
              }}
            />
            <Text style={{fontSize: 20, fontWeight: 'bold', }}>
              Add node 
            </Text>
          </Content> 
          : null
        }

      </Container>

    );
  }
}

const styles = StyleSheet.create({
  paddingStatusBar: {
    paddingTop: Constants.statusBarHeight,
  },
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
  },
  textInput: {
    height: 40,
    paddingLeft: 6
  },
});
