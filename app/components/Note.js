var React = require('react-native');
var View = React.View;
var Text = React.Text;
var StyleSheet = React.StyleSheet;
var TouchableOpacity = React.TouchableOpacity;
var Modal = React.Modal;
var TextInput = React.TextInput;
var api = require('../lib/api');

var moment = require('moment');
var Button = require('react-native-button');

var Icon = require('react-native-vector-icons/FontAwesome');

var Note = React.createClass({
  getInitialState: function () {
    return {
      modalVisible: false,
      instanceId: null,
      rowData: null,
      date: null,
      note: { note: '' } 
    };
  },
  
  componentWillReceiveProps: function (props) {
    this.setState({
      modalVisible: props.visible,
      instanceId: props.instanceId,
      rowData: props.rowData,
      date: props.date,
      note: props.note
    });
  },
  
  updateHabit: function () {
    var _this = this;
    fetch(process.env.SERVER + '/habits/' + this.props.profile.email + '/' + this.props.habit._id + '/' + this.props.instanceId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.token.idToken
      },
      body: JSON.stringify(this.state.note)
    })
    .then(api.handleErrors)
    .then(function (response) {
      _this.props.hideModal();
      
    })
    .then(function () {
      _this.props.getRowData();
    })
    .catch(function (err) {
      console.warn(err);
    });
  },
  
  handleUpdate: function () {
    this.updateHabit();
  },
  
  handleDeleteText: function () {
    this.setState( { note: { note: ''}} )
  },
  
  onTextChange: function (text) {
    this.setState({
      note: { note: text}
    });
  },
  
  render: function () {
    var modalBackgroundStyle = {backgroundColor: 'rgba(0, 0, 0, 0.5)'};
    var innerContainerTransparentStyle = {backgroundColor: '#fff', padding: 20};

    return (
      <View>
        <Modal 
          animated={true}
          transparent={true}
          visible={this.state.modalVisible} >
          <View style={[styles.container, modalBackgroundStyle]}>
            <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
              <Text style={{fontSize: 15, marginBottom: 20}}>{moment(this.props.date).format('MMMM Do YYYY')}</Text>
              <TextInput
                style={{height: 250, width: 300, fontSize: 18, borderColor: 'white', borderWidth: 1}}
                defaultValue={this.state.note.note}
                autoFocus={true}
                placeholder="Write a note.."
                onChangeText={this.onTextChange}
                multiline={true}
                maxLength={200}
              />
              <View style={styles.formControls}>
                <Icon.Button name="times-circle" size={20} iconStyle={{color:"#FFFFFF"}}
                  onPress={this.handleDeleteText}
                  style={styles.modalButton}>
                </Icon.Button>
                <Icon.Button name="save" size={20} iconStyle={{color:"#FFFFFF"}}
                  onPress={this.handleUpdate}
                  style={styles.modalButton}>
                </Icon.Button>
                <Icon.Button name="close" size={20} iconStyle={{color:"#FFFFFF"}}
                  onPress={this.props.hideModal}
                  style={styles.modalButton}>
                </Icon.Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  
});

var styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20
    },
    innerContainer: {
      borderRadius: 10,
      height: 400,
      alignItems: 'center'
    },
    modalButton: {
      marginTop: 10
    },
    formControls: {
      flexDirection: 'row',
      padding: 10,
    }
});

module.exports = Note;