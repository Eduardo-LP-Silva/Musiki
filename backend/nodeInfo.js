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
            }
        ]
    },
    "artist": {
        validation: "Artist,NaturalPerson",
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
                name: "singles",
                property: "dbo:artist",
                reverse: true,
                validationKey: "rdf:type",
                validationValue: "Single"
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
                name: "bands",
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
                name: "bands",
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
                name: "bands",
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
                name: "artists",
                property: "dbo:musicalArtist",
                reverse: false
            },
            {
                name: "bands",
                property: "dbo:musicalBand",
                reverse: false
            },
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
