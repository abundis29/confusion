





import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { LEADERS } from '../shared/leaders';



class Contact extends Component {

    static navigationOptions = {
        title: 'Our History'
    };

    render() {
        return (
            <ScrollView>


                <Card
                    title='Contact Information'>
                    <Text style={{ marginBottom: 10 }}>
                        Our Address
                    </Text>

                    <Text style={{ marginBottom: 10 }}>
                        121, Clear Water Bay Road
                    </Text>

                    <Text style={{ marginBottom: 10 }}>
                        121, Clear Water Bay RoadClear Water Bay, Kowloon
                    </Text>

                    <Text style={{ marginBottom: 10 }}>
                        HONG KONG
                    </Text>

                    <Text style={{ marginBottom: 10 }}>
                        Tel: +852 1234 5678
                    </Text>

                    <Text style={{ marginBottom: 10 }}>
                        Fax: +852 8765 4321
                    </Text>

                    <Text style={{ marginBottom: 10 }}>
                        Email:confusion@food.net
                    </Text>

                </Card>

            </ScrollView>
        );
    }
}

export default Contact;