import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Colors, View, Text, ListItem, AnimatedImage, ThemeManager, BorderRadiuses, Badge, Card } from 'react-native-ui-lib';
import AntIcons from 'react-native-vector-icons/AntDesign';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../utils'
const styles = StyleSheet.create({
    image: {
        width: 48,
        height: 48,
        borderRadius: BorderRadiuses.br20,
        margin: 12,
        marginLeft: 0
    },
    border: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: ThemeManager.dividerColor,
    },
});

class RepairItem extends Component {
    render() {
        let { item, navigation, pressfn, hidden,children } = this.props;

        let getColor = (item) => {
            let color = "#43c4cc"
            switch (item.status) {
                case 0:
                    color = "#ffcb01";
                    break;
                case 1:
                    color = "#5477ff";
                    break;
                case 2:
                    color = "#cc0d01";
                    break;
                case 3:
                    color = "#43c4cc";
                    break;
                case 4:
                    color = "#54bbff";
                    break;
                case 5:
                    color = "#999999";
                    break;
            }
            return color
        }

        return <Card
            enableShadow={false}
            borderRadius={0}
            activeBackgroundColor={Colors.dark60}
            activeOpacity={0.3}
            height={hidden ? 70 : 108}
            paddingH-12
            style={styles.border}
            onPress={() => {
                pressfn()
            }}
        >
            {children ? children : <View height={8}></View>}

            <View row spread paddingB-8>
                <Text body dark10 numberOfLines={1}><Text style={{ color: getColor(item) }}>| </Text>{item.taskNo}</Text>
                <View row center>
                    <Text subbody dark100 marginR-3 style={{ color: getColor(item) }}>{item.statusName}</Text>
                    <Badge size='small' backgroundColor={getColor(item)}></Badge>
                </View>
            </View>
            {
                hidden ? null : <View row height={60} spread style={{ alignItems: "center" }}>
                    <AnimatedImage
                        containerStyle={styles.image}
                        style={{ resizeMode: 'cover', height: 48, width: 48 }}
                        source={ item.faultPicUrl ? { uri: item.faultPicUrl } :require("../assets/404.png")}
                        loader={<ActivityIndicator />}
                    />
                    <View flex-1 paddingV-6>
                        <View row spread top flex-1>
                            <View>
                                <Text body numberOfLines={1}>{item.equipmentName}</Text>
                            </View>
                            <View flex-1 right>
                                <Text subbody numberOfLines={1}>故障等级:{item.faultLevelName}</Text>
                            </View>
                        </View>
                        <View flex-1 bottom>
                            <View row spread>
                                <View flex-1>
                                    <Text subbody numberOfLines={1}>编号:{item.equipmentNo}</Text>
                                </View>
                                <View flex-1 right>
                                    <Text subbody numberOfLines={1}>维修类型:{item.repairTypeName}</Text>
                                </View>

                            </View>
                        </View>
                    </View>
                </View>
            }



        </Card>
    }
}





export default RepairItem
