import React from 'react';
import { connect } from 'react-redux';
import { View, Text, Card, Colors, Button, Badge, Avatar, TabBar } from 'react-native-ui-lib';
import { SafeAreaViewPlus, Header, OneToast, UserItem, Empty, TreeShown } from '../../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ImageBackground, Dimensions, StyleSheet, ScrollView, Linking, ListItem, AnimatedImage } from 'react-native';
import { colors, ConvertPinyin } from '../../../utils';


let { height, width } = Dimensions.get('window');

@connect(({ index, loading }) => ({
    index,
    submitting: loading.effects['index/department'],
}))
class DepartMent extends React.Component {

    //设置新状态
    setNewState(type, values, fn) {
        const { dispatch } = this.props;
        dispatch({
            type: 'index/' + type,
            payload: values
        }).then((res) => {
            if (!res) {
                return
            }
            fn ? fn() : null
        })
    }

    componentDidMount() {
        if(this.props.navigation.state.params){
            console.log(this.props.navigation.state.params.posturl)
            this.setNewState(this.props.navigation.state.params.posturl);

        }else{
            this.setNewState("department");
        }
        
    }


    render() {

        let { index, navigation, submitting, index: { department } } = this.props;
        let { posturl,can,title } = navigation.state.params?navigation.state.params:{};
        return <SafeAreaViewPlus loading={submitting}>
            <Header title={title?title:`部门列表`} navigation={navigation}>
            </Header>

            <TreeShown navigation={navigation} data={posturl?this.props.index[posturl]:department} clickable={!can?true:false}>

            </TreeShown>


        </SafeAreaViewPlus>

    }
}

const styles = StyleSheet.create({

})


export default DepartMent