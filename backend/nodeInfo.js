exports.nodeInfo = {
    "band": {
        validation: "MusicGroup",
        filters: [
            {
                name: "artists",
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
        validation: "album",
        filters: [
            {
                name: "artists",
                property: "dbo:artist",
                reverse: false
            },
            {
                name: "genres",
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
        validation: "Single",
        filters: [
            {
                name: "artists",
                property: "dbo:artist",
                reverse: false
            },
            {
                name: "genres",
                property: "dbo:genre",
                reverse: false
            },
        ]
    },
    "song": {
        validation: "song",
        filters: [
            {
                name: "genres",
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
