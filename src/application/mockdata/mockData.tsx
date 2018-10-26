// Some mock data please

export let selectedPathData : any = {
    data: {
        name: 'flare'
    }
}

export let sunburstTestData : any = {
    name: 'flare',
    children: [
        {
            name: 'analytics',
            children: [
                {
                    name: 'cluster',
                    children: [
                        {name: 'Toute chose appartient à qui sait en jouir.', size: 1000},
                        {name: 'Mais si tu crois un jour que tu m\'aimes', size: 700}
                    ]
                },
                {
                    name: 'graph',
                    size: 500,
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
                    size: 800,
                },
                {
                    name: 'dataSet',
                    size: 500,
                }
            ]
        },
    ]
}
