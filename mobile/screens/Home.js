import * as React from 'react';
import { Text, View, StyleSheet, Alert, AsyncStorage  } from 'react-native';
import { Button as ButtonReact } from 'react-native';
import { Constants } from 'expo';

import { Container, Header, Left, Body, Right, Button, Icon, Title, List, ListItem, Content, Item, Label, Input, Spinner } from 'native-base';
import Modal from "react-native-modal";

const STORE_ZONE = '__ZONE'
const STORE_NODE_ID = '__NODE_ID'

export default class Home extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });
  
  constructor(props) {
    super(props);
    this.state = {
      listZone: [],
      isVisible: false,
      zoneName: '',
      isStoreGetIt: false,
    };
    this.deleteList = this.deleteList.bind(this)
  }

  componentDidMount() {
    this.bootstrapAsync()
  }
  
  bootstrapAsync = async () => {
    let zoneFile = await AsyncStorage.getItem(STORE_ZONE)
    let zone = JSON.parse(zoneFile);
    if( zone ) {
      this.setState({
        listZone: zone
      })
      console.log('bootstrapAsync', this.state.listZone) 
    } 
    this.setState({
      isStoreGetIt: true
    })
  }

  saveZone = () => {
    let zoneNameIndex = this.state.listZone.indexOf(this.state.zoneName)
    if(zoneNameIndex >= 0) {
      Alert.alert(
        'Alert!',
        'Zone name Exist',
        [                        
          {text: 'OK', },
        ],
        {cancelable: false},
      )
    } else if(this.state.zoneName == '') {
      Alert.alert(
        'Alert!',
        'Please Enter zone name',
        [                        
          {text: 'OK', },
        ],
        {cancelable: false},
      )
    } else {
      console.log(this.state.zoneName) 
      this.setState({isVisible: false}) 
      this.setState({ listZone: [...this.state.listZone, this.state.zoneName] },
        async () => {
          console.log('It was saved successfully ->', this.state.listZone)
          await AsyncStorage.setItem(STORE_ZONE, JSON.stringify(this.state.listZone) )
          .then( ()=>{
              console.log('1 It was saved successfully')
          } )
          .catch( ()=>{
              console.log('There was an error saving the product') 
          } )

          await AsyncStorage.setItem(this.state.zoneName, '[]' )
          .then( ()=>{
              console.log('It was saved successfully 1', '>', this.state.zoneName, '<') 
          } )
          .catch( ()=>{
              console.log('There was an error saving the product')
          } )
  
        } 
      )
    }    
  }

  clearStorage = async () => {
    try {
      console.log('clearStorage')
      await AsyncStorage.setItem(STORE_ZONE, '[]' )
        .then( ()=>{
            console.log('It was saved successfully')
        } )
        .catch( ()=>{
            console.log('There was an error saving the product')
        } )

      await AsyncStorage.setItem(STORE_NODE_ID, '[]' )
        .then( ()=>{
            console.log('It was saved successfully')
        } )
        .catch( ()=>{
            console.log('There was an error saving the product')
        } )
    
    } catch (error) {
      console.log('clearStorage Error')
    }
  }

  deleteList = (value) => {
    Alert.alert(
      'Delete zone?',
      value,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', 
        onPress: () => { 
          let array = this.state.listZone.filter((item) => {
            return item !== value
          });
          console.log('OK Pressed', value, array); 
          this.setState( {listZone: array} ,
            async () => {
              await AsyncStorage.setItem(STORE_ZONE, JSON.stringify(this.state.listZone) )
              .then( ()=>{
                  console.log('delete, It was saved successfully')
              } )
              .catch( ()=>{
                  console.log('delete, There was an error saving the product')
              } )

              let zoneNameFile = await AsyncStorage.getItem(value)
              zoneNameFile = JSON.parse(zoneNameFile);
              console.log('zoneNameFile ->', zoneNameFile)
              if(zoneNameFile.length == 0) {
                console.log('zoneNameFile == 0')
              } else {
                let nodeIdNameFile = await AsyncStorage.getItem(STORE_NODE_ID)
                nodeIdNameFile = JSON.parse(nodeIdNameFile);
                console.log('nodeIdNameFile ->', nodeIdNameFile)
                for(let i=0; i<zoneNameFile.length; i++) {
                  for(let j=0; j<nodeIdNameFile.length; j++) {
                    if(zoneNameFile[i].id == nodeIdNameFile[j].id) {
                      nodeIdNameFile = nodeIdNameFile.filter(e => e.id !== nodeIdNameFile[j].id)
                      break
                    }                    
                  }
                }
                console.log('2 nodeIdNameFile ->', nodeIdNameFile)
                await AsyncStorage.setItem(value, JSON.stringify(nodeIdNameFile))
              }
      
            } 
          ) 
        }},
      ],
      {cancelable: false},
    );
  }

  render() {
    
    modalButtonPress = (value) => {
      console.log(value)
    }

    return (
      <Container style={styles.paddingStatusBar} >
        <Header>
          <Left>
            <Button transparent>
              <Icon name='md-refresh' onPress={  this.clearStorage } />
            </Button>
          </Left>
          <Body style={{ marginLeft: 10 }} >
            <Title>Zone</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='add' style={{ fontSize: 40,}} onPress={ () => { 
                this.setState({ isVisible: true }) 
                this.setState({ zoneName: '' })
              }} />
            </Button>
          </Right>
        </Header>
        
        <Content >
          <List 
            dataArray={this.state.listZone}             
            renderRow={ (item) => (
              <ListItem onPress={() => this.props.navigation.navigate('Zone',{
                zoneName: item,
              })} >
                <Left>
                  <Text >{item}</Text>
                </Left>
                <Right>
                  <Icon 
                    name="md-remove-circle" 
                    style={{color: 'red', fontSize: 35,}}
                    onPress={ () => { this.deleteList(item) } }      
                  />
                </Right>
              </ListItem>
            )}
          /> 

          <Modal 
            isVisible={this.state.isVisible}
          >
            <View style={styles.modalContent} >
              <Item floatingLabel last>
                <Label>Zone name</Label>
                <Input 
                  onChangeText={(text)=>{ this.setState({zoneName: text})}}
                
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
                this.setState({ zoneName: '' })
              }}
            />
            <Text style={{fontSize: 20, fontWeight: 'bold', }}>
              Add zone 
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
    alignSelf: 'center',
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
