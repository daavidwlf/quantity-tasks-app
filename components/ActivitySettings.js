import React, { Component, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableHighlight } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const {width, height} = Dimensions.get('screen');

const ActivitySettings = ({goal, setGoal}) => {

    const scrollViewRef = useRef(ScrollView);
    const [numbers, setNumbers] = useState([]);

    const getNumbers= () =>{
        try{
            setNumbers(require('../data/numbers.json'))
        }catch(err){
            console.log("Error:", err)
        }
    }

    useEffect(()=>{
        getNumbers()
        setTimeout(()=>{
            scrollViewRef.current.scrollTo({x: 80*goal-80, y: 0, animated: false});
        },500)
    },[])

    const detectScroll = ({layoutMeasurement, contentOffset, contentSize}) =>{
        if((contentOffset.x/80+1) % 1 == 0){
            setGoal(contentOffset.x/80+1)
        }
    }

    const switchGoal = (direction) => {
        scrollViewRef.current.scrollTo({x: 80*(goal+direction)-80, y: 0, animated: true});
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ziel</Text>
            <View style={styles.selectionContainer}>
                {
                    goal != 1 ?
                    <TouchableHighlight onPress={() => switchGoal(-1)} underlayColor={'transparent'} activeOpacity={0.3}>
                        <Entypo name="chevron-left" size={24} color='rgba(200,200,200,1)' />
                    </TouchableHighlight>
                    :
                    <Entypo name="chevron-left" size={24} color='rgba(200,200,200,0.5)' />
                    }
                <View style={styles.scollContainer}>
                    <ScrollView
                       ref={scrollViewRef}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        decelerationRate={0}
                        snapToInterval={80}
                        onScroll={({nativeEvent})=>{
                            detectScroll(nativeEvent)
                        }}
                        scrollEventThrottle={400}
                    >{
                        numbers.map((item, index) =>{
                            return (
                                <View key={index} style={styles.numberContainer}>
                                    <Text style={styles.number} allowFontScaling={false}>{item}</Text>
                                </View>
                            )
                        })
                        }
                    </ScrollView>
                </View>
                {
                    goal != 30 ?
                    <TouchableHighlight onPress={() => switchGoal(1)} underlayColor={'transparent'} activeOpacity={0.3}>
                        <Entypo name="chevron-right" size={24} color='rgba(200,200,200,1)' />
                    </TouchableHighlight>
                    :
                    <Entypo name="chevron-right" size={24} color='rgba(200,200,200,0.5)' />
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },

    title:{
        fontFamily: 'Supreme-Medium',
        fontSize: width/16,
        color: 'white',
        marginBottom: 20
    },

    selectionContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },

    scollContainer:{
        backgroundColor: 'rgba(200,200,200,1)',
        width: 80,
        height: 80,
        borderRadius: 10,
    },

    numberContainer:{
        height:80,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        
    },

    number:{
        fontSize: width/14,
        fontFamily: 'Supreme-Medium',
        color: 'rgba(39, 138, 245, 1)',
    }
});

export default ActivitySettings;