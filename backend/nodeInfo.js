exports.nodeInfo = {
    "artist": {
        //Maybe add validation key?
        /* Maybe add more than one? Organization only applies to bands / groups, and I couldn't find a common attribute 
        ** between bands and solo artists specific enough
        */
        //key: rdf:type
        validation: "organization", //Maybe change to MusicGroup
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
                validationKey: "dbp:type", //maybe change to rdf:type (some albumns don't have dpb:type), but duplicate values must be dealt with
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
                validationValue: "Song"
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
                validationKey: "rdf:type",
                validationValue: "Song"
            }
        ]
    }
}
