// Some mock data please

export let sunburstTestData : any = {
    name: 'root',
    children: [
        {
            name: 'analytics',
            children: [
                {
                    name: 'cluster',
                    children: [
                        {name: 'singleWord', size: 1000},
                        {name: 'singleWord2', size: 700}
                    ]
                },
                {
                    name: 'graph',
                    children: [
                        {name: 'dammitIsItPossible', size: 500},
                        {name: 'elementary', size: 300}
                    ]
                },
                {
                    name: 'optimization',
                    size: 700,
                }
            ]
        },
        {
            name: 'data',
            children: [
                {
                    name: 'converters',
                    children: [
                        {name: 'dammitIsItPossible', size: 500},
                        {name: 'elementary', size: 300}
                    ]
                },
                {
                    name: 'dataSet',
                    size: 500,
                }
            ]
        },
    ]
}
