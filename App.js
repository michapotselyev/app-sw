import * as React from 'react';
import { Text, View, StatusBar, TouchableOpacity, ScrollView, Alert, ActivityIndicator, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { DataTable, Searchbar } from 'react-native-paper';
import axios from 'axios';
import styled from 'styled-components/native';

const Header = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin: 20px 10px;
    margin-left: 3px;
`;

const Main = styled.View`
    flex-direction: column;
    margin-left: 10px;
    margin-right: 10px;
`;

const CountFans = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

const GenderCount = styled.View`
    border: 1px solid grey;
    width: 31%;
    border-radius: 4px;
`;

const ClearButton = styled.TouchableOpacity`
    font-size: 14px;
    padding: 5px 20px;
    margin-top: 8px;
    border-radius: 4px;
    border: 1px solid red;
`;

export default function App() {
    const [page, setPage] = React.useState(0);
    const [items, setItems] = React.useState([]);
    const [searchItems, setSearchItems] = React.useState([]);
    const [itemsCount, setItemsCount] = React.useState(0);
    const [load, setLoad] = React.useState(true);
    const [checked, setChecked] = React.useState([]);
    const [femaleCount, setFemaleCount] = React.useState(0);
    const [maleCount, setMaleCount] = React.useState(0);
    const [otherCount, setOtherCount] = React.useState(0);
    const [dataHomeWAndSpec, setDataHomeWAndSpec] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const from = page * 10;
    const to = (page + 1) * 10;

    const LoadData = (page) => {
        setLoad(true);
        if (page === 0) {
            axios.get(`https://swapi.dev/api/people/`).then(({ data }) => {
                setDataHomeWAndSpec([]);
                data.results.map(e => {
                    axios.get(e.homeworld).then(( { data } ) => {
                        if (e.species.length === 0) {
                            setDataHomeWAndSpec(dataHomeWAndSpec => [...dataHomeWAndSpec, { name: e.name, homeworld: data.name, species: ' ' }]);
                        } else {
                            axios.get(e.species[0]).then(res => { 
                                setDataHomeWAndSpec(dataHomeWAndSpec => [...dataHomeWAndSpec, { name: e.name, homeworld: data.name, species: res.data.name }]);
                            });
                        }
                    });
                });
                setItems(data.results);
                setItemsCount(data.count);
            }).catch(err => {
                console.log(err);
                Alert.alert('Error:', 'Can\'t get data!');
            }).finally(() => setLoad(false));
        } else {
            axios.get(`https://swapi.dev/api/people/?page=${page+1}`).then(({ data }) => {
                setDataHomeWAndSpec([]);
                data.results.map(e => {
                    axios.get(e.homeworld).then(( { data } ) => {
                        if (e.species.length === 0) {
                            setDataHomeWAndSpec(dataHomeWAndSpec => [...dataHomeWAndSpec, { name: e.name, homeworld: data.name, species: ' ' }]);
                        } else {
                            axios.get(e.species[0]).then(res => { 
                                setDataHomeWAndSpec(dataHomeWAndSpec => [...dataHomeWAndSpec, { name: e.name, homeworld: data.name, species: res.data.name }]);
                            });
                        }
                    });
                });
                setItems(data.results);
            }).catch(err => {
                console.log(err);
                Alert.alert('Error:', 'Can\'t get data!');
            }).finally(() => setLoad(false) );
        }
    }

    const switchFun = (person) => {
        if (checked.includes(person.name)) {
            if (person.gender === 'female') {
                setFemaleCount(femaleCount => femaleCount - 1);
            } else if (person.gender === 'male') {
                setMaleCount(maleCount => maleCount - 1);
            } else {
                setOtherCount(otherCount => otherCount - 1);
            }
            return setChecked(checked.filter(e => e !== person.name));
        }
        if (person.gender === 'female') {
            setFemaleCount(femaleCount => femaleCount + 1);
        } else if (person.gender === 'male') {
            setMaleCount(maleCount => maleCount + 1);
        } else {
            setOtherCount(otherCount => otherCount + 1);
        }
        return setChecked(checked => [...checked, person.name]);
    }

    const clearData = () => {
        setFemaleCount(0);
        setMaleCount(0);
        setOtherCount(0);
        setChecked([]);
    }

    const HomeWorld = (name) => {
        const arr = dataHomeWAndSpec.find(e => {
            if (e.name === name) {
                return e;
            }
        });

        if (arr === undefined) {
            return ' ';
        } else {
            return arr.homeworld;
        }
    }

    const Species = (name) => {
        const arr = dataHomeWAndSpec.find(e => {
            if (e.name === name) {
                return e;
            }
        });
        
        if (arr === undefined) {
            return ' ';
        } else {
            return arr.species;
        }
    }

    const onChangeSearch = (text) => {
        setSearchQuery(text);
        const updatedData = items.filter((item) => {
            const item_data = `${item.name.toUpperCase()})`;
            const text_data = text.toUpperCase();
            return item_data.indexOf(text_data) > -1;
        });
        setSearchItems(updatedData);
    }

    React.useEffect(() => {
        LoadData(0);
    },[]);

    if (load) {
        return <ActivityIndicator style={ { alignItems: 'center' } } size="large" />
    } else {
        return (
            <ScrollView style={{ height: 1000 }}>
                <View>
                    <Header>
                        <Text style={ { fontSize: 32 } }> Fans </Text>
                        <TouchableOpacity>
                            <ClearButton onPress={ clearData }>
                                <Text style={ { color: 'red' } }>CLEAR FANS</Text>
                            </ClearButton>
                        </TouchableOpacity>
                    </Header>
                    <Main>
                        <CountFans>
                            <GenderCount>
                                <Text style={ { fontSize: 32 } }> {femaleCount} </Text>
                                <Text style={ { fontSize: 12.8, marginLeft: 7, marginBottom: 3 } }> Female </Text>
                            </GenderCount>

                            <GenderCount>
                                <Text style={ { fontSize: 32 } }> {maleCount} </Text>
                                <Text style={ { fontSize: 12.8, marginLeft: 7, marginBottom: 3 } }> Male </Text>
                            </GenderCount>

                            <GenderCount>
                                <Text style={ { fontSize: 32 } }> {otherCount} </Text>
                                <Text style={ { fontSize: 12.8, marginLeft: 7, marginBottom: 3 } }> Other </Text>
                            </GenderCount>
                        </CountFans>
                        <Searchbar
                            placeholder='Search...'
                            autoCorrect={false}
                            mode='view'
                            onChangeText={(text) => onChangeSearch(text)}
                            value={searchQuery}
                            style={{ marginTop: 15, backgroundColor: 'none' }}
                        />
                        <ScrollView horizontal>
                            <DataTable>
                                <DataTable.Row style={ { display: 'flex', width: 1112 } }>
                                    <DataTable.Cell style={ { minWidth: 30, maxWidth: 30, borderRightColor: 'rgb(224, 224, 224)', borderRightWidth: 1 } }>
                                        <AntDesign name='heart' size={16} color="black" />
                                    </DataTable.Cell>
                                    <DataTable.Cell style={ { flexGrow: 2, paddingHorizontal: 10, borderRightColor: 'rgb(224, 224, 224)', borderRightWidth: 1 } }>Name</DataTable.Cell>
                                    <DataTable.Cell style={ { flexGrow: 1, paddingHorizontal: 10, borderRightColor: 'rgb(224, 224, 224)', borderRightWidth: 1 } }>Birth Date</DataTable.Cell>
                                    <DataTable.Cell style={ { flexGrow: 1, paddingHorizontal: 10, borderRightColor: 'rgb(224, 224, 224)', borderRightWidth: 1 } }>Gender</DataTable.Cell>
                                    <DataTable.Cell style={ { flexGrow: 1, paddingHorizontal: 10, borderRightColor: 'rgb(224, 224, 224)', borderRightWidth: 1 } }>Home World</DataTable.Cell>
                                    <DataTable.Cell style={ { flexGrow: 1, paddingHorizontal: 10, } }>Species</DataTable.Cell>
                                </DataTable.Row>
                                <FlatList 
                                    data={ searchQuery === '' ? items : searchItems }
                                    renderItem={({ item }) => (
                                        <DataTable.Row style={ { display: 'flex', width: 1112 } }>
                                            <DataTable.Cell style={ { minWidth: 30, maxWidth: 30, borderRightColor: 'rgb(224, 224, 224)', borderRightWidth: 1 } }>
                                            {
                                                checked.includes(item.name) ?
                                                <TouchableOpacity onPress={() => switchFun(item) }>
                                                    <AntDesign name='heart' size={16} color="red" />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity onPress={() => switchFun(item) }>
                                                    <AntDesign name='hearto' size={16} color="red" />
                                                </TouchableOpacity>
                                            }
                                            </DataTable.Cell>
                                            <DataTable.Cell style={ { flexGrow: 2, paddingHorizontal: 10, borderRightColor: 'rgb(224, 224, 224)', borderRightWidth: 1 } }>{item.name}</DataTable.Cell>
                                            <DataTable.Cell style={ { flexGrow: 1, paddingHorizontal: 10, borderRightColor: 'rgb(224, 224, 224)', borderRightWidth: 1 } }>{item.birth_year}</DataTable.Cell>
                                            <DataTable.Cell style={ { flexGrow: 1, paddingHorizontal: 10, borderRightColor: 'rgb(224, 224, 224)', borderRightWidth: 1 } }>{item.gender}</DataTable.Cell>
                                            <DataTable.Cell style={ { flexGrow: 1, paddingHorizontal: 10, borderRightColor: 'rgb(224, 224, 224)', borderRightWidth: 1 } }>{HomeWorld(item.name)}</DataTable.Cell>
                                            <DataTable.Cell style={ { flexGrow: 1, paddingHorizontal: 10 } }>{Species(item.name)}</DataTable.Cell>
                                        </DataTable.Row>
                                    )} 
                                    keyExtractor={(item) => item.id} 
                                />
                                <DataTable.Pagination
                                    page = { page }
                                    numberOfPages = { Math.floor(itemsCount / 10) }
                                    onPageChange = { page => { setPage(page); LoadData(page); } }
                                    label={`${from + 1}-${to} of ${itemsCount}`}
                                />
                            </DataTable>
                        </ScrollView>
                    </Main>
                    <StatusBar style="auto" />
                </View>
            </ScrollView>
        );
    }
}

