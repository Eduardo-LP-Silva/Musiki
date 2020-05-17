exports.nodeInfo = {
    "Artist" : {
        validation: "Organization",
        filters: [
                    {
                        name: "Members",
                        property: "dbo:bandMember",
                        reverse: false,
                    },
                    {
                        name: "Genres",
                        property: "dbo:genre",
                        reverse: false,
                    },
                    {
                        name: "Albums",
                        property: "dbo:artist",
                        reverse: true,
                        validationKey: "dbp:type",
                        validationValue: "album"
                    },
                    
                 ]
    }

}
