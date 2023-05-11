//The structure of your tree
const tree = {
    key_1: {
        key_2: '',
        key_3: '',
        key_4: '',
        key_5: ''
    },
};

//The parameters of your tree
const params = {
    key_1: {trad: 'Card 1', styles: {'box-shadow': '0 0 15px 2px blue'}},
    key_2: {trad: 'Card 2', styles: {'color': 'red'}},
    key_3: {trad: 'Card 3'},
    key_4: {trad: 'Card 4'},
    key_5: {trad: 'Card 5'},
};

//The function which will build the tree
treeMaker(tree, {
    id: 'my_tree', card_click: function (element) {
        console.log(element);
    },
    treeParams: params,
    'link_width': '4px',
    'link_color': '#ff5259',
});

