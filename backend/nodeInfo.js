exports.nodeInfo = {
    "band": {
        //Maybe add validation key?
        //key: rdf:type
        validation: "MusicGroup",
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
            {
                name: "singles",
                property: "dbo:musicalArtist",
                reverse: true,
                validationKey: "rdf:type",
                validationValue: "Single"
            },
            {
                name: "songs",
                property: "dbo:musicalArtist",
                reverse: true,
                validationKey: "rdfs:label",
                validationValue: "song"
            }

        ]
    },
    "artist": {
        //key: rdf:type
        validation: "Artist",
        filters: [
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
            {
                name: "songs",
                property: "dbo:musicalArtist",
                reverse: true,
                validationKey: "rdfs:label",
                validationValue: "song"
            },
            {
                name: "bands",
                property: "dbo:bandMember",
                reverse: true,
                validationKey: "rdf:type",
                validationValue: "MusicGroup"
            }
        ]
    },
    "genre": {
        //key: rdf:type
        validation: "Genre",
        filters: [
            {
                name: "artists",
                property: "dbo:genre",
                reverse: true,
                validationKey: "rdf:type",
                validationValue: "MusicGroup"
            },
            {
                name: "albums",
                property: "dbo:genre",
                reverse: true,
                validationKey: "dbp:type",
                validationValue: "album"
            },
            {
                name: "singles",
                property: "dbo:genre",
                reverse: true,
                validationKey: "rdf:type",
                validationValue: "Single"
            },
            {
                name: "songs",
                property: "dbo:genre",
                reverse: true,
                validationKey: "rdfs:label",
                validationValue: "song"
            }
        ]
    },
    "album": {
        //key: dbp:type
        validation: "album",
        filters: [
            {
                name: "artist",
                property: "dbo:artist",
                reverse: false
            },
            {
                name: "genre",
                property: "dbo:genre",
                reverse: false
            },
            {
                name: "songs",
                property: "dbp:title",
                reverse: false
            }
        ]
    },
    "single": {
        //key: rdf:type
        validation: "Single",
        filters: [
            {
                name: "artist",
                property: "dbo:artist",
                reverse: false
            },
            {
                name: "genre",
                property: "dbo:genre",
                reverse: false
            },
        ]
    },
    "song": {
        //key: rdfs:label
        validation: "song",
        filters: [
            {
                name: "genre",
                property: "dbo:genre",
                reverse: false,
            },
            {
                name: "albums",
                property: "dbp:title",
                reverse: true,
                validationKey: "dbp:type",
                validationValue: "album"
            },
        ]
    }
}
