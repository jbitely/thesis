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

var Note = React.createClass({
  getInitialState: function () {
    return {
      modalVisible: false,
      instanceId: null,
      rowData: null,
      note: ''
    };
  },
  
  hideModal: function () {
    this.setState({modalVisible: false});
  },
  
  componentWillReceiveProps: function (props) {
    console.log('PROP', props);
    this.setState({
      modalVisible: props.visible,
      instanceId: props.instanceId,
      rowData: props.rowData,
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
      console.log('RESPONSE', response);
      _this.hideModal();
    })
    .catch(function (err) {
      console.warn(err);
    });
  },
  
  handleUpdate: function () {
    // fetch(POST call to send note)
    this.updateHabit();
  },
  
  onTextChange: function (text) {
    this.setState({
      note: text
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
              <Text>Add Note</Text>
              <TextInput
                style={{height: 40, borderColor: 'white', borderWidth: 1}}
                defaultValue={this.state.note}
                // editable={false}
                // onfocus={}
                placeholder="Write a note.."
                onChangeText={this.onTextChange}
              />
              <Button
                onPress={this.handleUpdate}
                style={styles.modalButton}>
                Update
              </Button>
              <Button 
                onPress={this.hideModal}
                style={styles.modalButton}>
                Close
              </Button>
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
      padding: 20,
    },
    innerContainer: {
      borderRadius: 10,
      height: 400,
      alignItems: 'center'
    },
    modalButton: {
      marginTop: 10
    }
});

module.exports = Note;