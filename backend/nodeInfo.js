exports.nodeInfo = {
    "artist" : {
        validation: "organization",
        filters: [
                    {
                        name: "members",
                        property: "dbo:bandMember",
                        reverse: false,
                    },
                    {
                        name: "genres",
                        property: "dbo:genre",
                        reverse: false,
                    },
                    {
                        name: "albums",
                        property: "dbo:artist",
                        reverse: true,
                        validationKey: "dbp:type",
                        validationValue: "album"
                    },
                    
                 ]
    }

}
