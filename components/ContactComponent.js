import React, { Component } from "react";
import { ScrollView, Text } from "react-native";
import { Card, Button, Icon } from "react-native-elements";
import { LEADERS } from "../shared/leaders";
import * as Animatable from "react-native-animatable";
import { MailComposer } from "expo";

class Contact extends Component {
  

  static navigationOptions = {
    title: "Our History",
  };

  sendMail() {
    MailComposer.composeAsync({
      recipients: ["confusion@food.net"],
      subject: "Enquiry",
      body: "To whom it may concern:",
    });
  }

  render() {
      
    return (
      <ScrollView>
        <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
          <Card title="Contact Information">
            <Text style={{ marginBottom: 10 }}>Our Address</Text>

            <Text style={{ marginBottom: 10 }}>121, Clear Water Bay Road</Text>

            <Text style={{ marginBottom: 10 }}>
              121, Clear Water Bay RoadClear Water Bay, Kowloon
            </Text>

            <Text style={{ marginBottom: 10 }}>HONG KONG</Text>

            <Text style={{ marginBottom: 10 }}>Tel: +852 1234 5678</Text>

            <Text style={{ marginBottom: 10 }}>Fax: +852 8765 4321</Text>

            <Text style={{ marginBottom: 10 }}>Email:confusion@food.net</Text>

            <Button
              title="Send Email"
              buttonStyle={{ backgroundColor: "#512DA8" }}
              icon={
                <Icon name="envelope-o" type="font-awesome" color="white" />
              }
              onPress={this.sendMail}
            />
          </Card>
        </Animatable.View>
      </ScrollView>
    );
  }
}

export default Contact;
