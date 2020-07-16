import React, { Component } from "react";
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Input, Rating } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite, postComment } from "../redux/ActionCreators";
import * as Animatable from "react-native-animatable";

function RenderDish(props) {
  const dish = props.dish;

    handleViewRef = ref => this.view = ref;

  const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
    if (dx < -200) return true;
    else return false;
  };

  const shareDish = (title, message, url) => {
    Share.share({
        title: title,
        message: title + ': ' + message + ' ' + url,
        url: url
    },{
        dialogTitle: 'Share ' + title
    })
}

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => {
      return true;
    },
    onPanResponderEnd: (e, gestureState) => {
      console.log("pan responder end", gestureState);
      if (recognizeDrag(gestureState))
        Alert.alert(
          "Add Favorite",
          "Are you sure you wish to add " + dish.name + " to favorite?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                props.favorite
                  ? console.log("Already favorite")
                  : props.onPress();
              },
            },
          ],
          { cancelable: false }
        );

      return true;
    },
    onPanResponderGrant: () => {this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},
  });

  if (dish != null) {
    return (
        <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
        ref={this.handleViewRef}
        {...panResponder.panHandlers}>
        <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }}>
          <Text style={{ margin: 10 }}>{dish.description}</Text>
          <View style={styles.formRow}>
            <Icon
              raised
              reverse
              name={props.favorite ? "heart" : "heart-o"}
              type="font-awesome"
              color="#f50"
              onPress={() =>
                props.favorite
                  ? console.log("Already favorite")
                  : props.onPress()
              }
            />
            <Icon
              raised
              reverse
              name="pencil"
              type="font-awesome"
              color="#512DA8"
              onPress={() => props.toggleModal()}
            />
             <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            style={styles.cardItem}
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
          </View>
        </Card>
      </Animatable.View>
    );
  } else {
    return <View></View>;
  }
}

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Rating
          readonly
          startingValue={item.rating}
          imageSize={12}
          style={{ width: 60 }}
        ></Rating>
        <Text style={{ fontSize: 12 }}>
          {"-- " + item.author + ", " + item.date}{" "}
        </Text>
      </View>
    );
  };

  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card title="Comments">
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </Card>
    </Animatable.View>
  );
}

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      showModal: false,
      comment: "",
      author: "",
      rating: 0,
    };
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  resetFormState() {
    this.setState({ comment: "", authoer: "", rating: 0 });
  }

  submitForm() {
    const dishId = this.props.navigation.getParam("dishId", "");
    console.log("rating " + this.state.rating);
    this.props.postComment(
      dishId,
      this.state.comment,
      this.state.author,
      this.state.rating
    );
  }

  static navigationOptions = {
    title: "Dish Details",
  };

  render() {
    const dishId = this.props.navigation.getParam("dishId", "");
    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some((el) => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          toggleModal={() => this.toggleModal()}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            (comment) => comment.dishId === dishId
          )}
        />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => {
            this.toggleModal();
          }}
          onRequestClose={() => {
            this.toggleModal();
          }}
        >
          <View style={styles.modal}>
            <Rating
              showRating
              minValue={1}
              startingValue={0}
              ratingCount={5}
              onFinishRating={(value) => this.setState({ rating: value })}
            ></Rating>
            <Input
              containerStyle={styles.modalText}
              placeholder=" Author"
              leftIcon={{ type: "font-awesome", name: "user" }}
              onChangeText={(value) => this.setState({ author: value })}
            />
            <Input
              containerStyle={styles.modalText}
              placeholder=" Comment"
              leftIcon={{
                type: "font-awesome",
                name: "comment",
                backgroundColor: "#ffffff",
              }}
              onChangeText={(value) => this.setState({ comment: value })}
            />
            <Button
              onPress={() => {
                this.toggleModal();
                this.submitForm();
              }}
              color="#512DA8"
              title="Submit"
            ></Button>
            <Text />
            <Button
              onPress={() => {
                this.toggleModal();
                this.resetFormState();
              }}
              color="#cccccc"
              title="Cancel"
            ></Button>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, comment, author, rating) =>
    dispatch(
      postComment({
        dishId: dishId,
        comment: comment,
        author: author,
        rating: rating,
      })
    ),
});

const styles = StyleSheet.create({
  formRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  formLabel: {
    fontSize: 18,
    flex: 2,
  },
  formItem: {
    flex: 1,
  },
  modal: {
    justifyContent: "center",
    margin: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#512DA8",
    textAlign: "center",
    color: "white",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    margin: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
