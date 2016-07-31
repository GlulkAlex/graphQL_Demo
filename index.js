"use strict";
/** basic GraphQL server, running over|via express
*/
// Import the required libraries
var graphql = require('graphql');
///import { ... } from 'graphql/type'; // ES6
//var GraphQLType = require('graphql/type'); // CommonJS
const GraphQLID         = graphql.GraphQLID,
      GraphQLInt        = graphql.GraphQLInt,
      GraphQLFloat      = graphql.GraphQLFloat,
      GraphQLString     = graphql.GraphQLString,
      GraphQLEnumType   = graphql.GraphQLEnumType,
      GraphQLList       = graphql.GraphQLList,
      GraphQLObjectType = graphql.GraphQLObjectType,
      GraphQLSchema     = graphql.GraphQLSchema,
      GraphQLNonNull    = graphql.GraphQLNonNull;
var graphqlHTTP = require('express-graphql');
var express = require('express');

// Import the data you created above
var data = require('./data.json');
var donors = require('./donors.json');

// Define the `User` type
// with two string `fields`:
//  `id` and `name`.
// The `type` of `User` is
//  GraphQLObjectType,
// which has child `fields`
// with their own types
// (in this case, GraphQLString).
var userType = new graphql.GraphQLObjectType({
  "name": "User",
  "fields": {
    "id": { type: graphql.GraphQLString },
    "name": { type: graphql.GraphQLString },
  }
});

const Category = new GraphQLEnumType({
  name: "Category",
  description: "A Category of the blog",
  values: {
    METEOR: {value: "meteor"},
    PRODUCT: {value: "product"},
    USER_STORY: {value: "user-story"},
    OTHER: {value: 'other'}
  }
});

var Blood_Type = new graphql.GraphQLEnumType({
  'name': "Blood_Type",
  'values': {
    // Error: Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "O−" does not.
    'O_negative': { value: 0 },
    'O_positive': { value: 1 },
    'A_negative': { value: 2 },
    'A_positive': { value: 3 },
    'B_negative': { value: 4 },
    'B_positive': { value: 5 },
    'AB_negative': { value: 6 },
    'AB_positive': { value: 7 }
  }
});

//var GeoPoint = new graphql.GraphQLInputObjectType({
var GeoPoint = new GraphQLObjectType({
  'name': "GeoPoint",
  'fields': {
    'lat': { type: new GraphQLNonNull(GraphQLFloat) },
    'lon': { type: new GraphQLNonNull(GraphQLFloat) },
    'alt': { type: GraphQLFloat, defaultValue: 0 },
  }
});

// http://localhost:3000/graphql?query={donor(id:%223%22){geoGraphical_Coordinates{lon,lat,alt},Blood_Group,Email_Address}}
var donor_Type = new GraphQLObjectType({
  'name': "Donor",
  "description": 'Blood donors.',
  'fields': () => ({
    "id": { type: GraphQLString },
    // from [user input]|form
    'First_Name': { "type": GraphQLString },
    'Last_Name': { "type": GraphQLString },
    // "+xx xxx xxxx xxx" or "00xx xxx xxxx xxx" <- 12 digits + ('+'|"00")
    'Contact_Number': { "type": GraphQLString },
    // "donor1@mail.ex" <- whatever with ([\d|[a..Z]|-|_]{1, 1+})@([a..Z]{2, 2+})\.([\d|[a..Z]]{2, 2+})
    'Email_Address': { "type": GraphQLString },
    // Blood type
    // enum O−	O+	A−	A+	B−	B+	AB−	AB+
    'Blood_Group': { "type": Blood_Type },
    // [auto fill]|generated
    /*
    A permalink (portmanteau of permanent link) is
    a URL that points to a specific web page,
    typically a blog or
    forum entry
    served by
    a content management system
    that uses a database.
    Because a permalink remains unchanged indefinitely,
    it is less susceptible to link rot.
    */
    // ID like:
    //http://reactivex.io/rxscala/scaladoc/index.html#rx.lang.scala.Observable@++[U>:T](that:rx.lang.scala.Observable[U]):rx.lang.scala.Observable[U]
    'private_Link': { "type": GraphQLString },
    // four decimal numbers, each ranging from 0 to 255, separated by dots
    // 172.16.254.1 (IPv4), and
    // An IPv6 address consists of 128 bits.
    // An IPv6 address is represented as
    // eight groups of four hexadecimal digits,
    // each group representing 16 bits (two octets).
    // The groups are separated by colons (:).
    // 2001:0db8:85a3:0000:0000:8a2e:0370:7334
    // relatively complicated rules to validate representation
    // 2001:db8:0:1234:0:567:8:1 (IPv6)
    'ip': { "type": GraphQLString },
    /*
    {
      "@context": "http://schema.org",
      "@type": "Place",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "40.75",
        "longitude": "73.98"
      },
      "name": "Empire State Building"
    }
    */
    'geoGraphical_Coordinates': { "type": GeoPoint }
  })
});

// Define the `schema`
// with one top-level `field`, `user`,
// that takes
// an `id` 'argument' and
// *returns*
// the `User` with that 'ID'.
// Note that
// the `query` is
//  a GraphQLObjectType, just like `User`.
// The `user` 'field', however, is
//  a 'userType',
// which we defined above.
var schema_0 = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      user: {
        type: userType,
        // `args` describes
        // the 'arguments' that the `user` 'query' *accepts*
        args: {
          id: { type: graphql.GraphQLString }
        },
        // The `resolve function` *describes*
        // how to "resolve" or *fulfill*
        // the _incoming_ `query`.
        // In this case
        // we use
        // the `id` 'argument' from above
        // as a `key`
        // to *get* the 'User' from `data`
        resolve: function (_, args) {
          return data[args.id];
        }
      }
    }
  })
});

// Introspection:
/*
{
  __schema {
    types {
      name
    }
  }
}
{__schema{types{name}}}
*/
var schema = new GraphQLSchema({
  "query": new GraphQLObjectType({
    "name": "Donors_Query",
    description: "Root of the Donors Schema",
    //"fields": {// if no update expected|evaluated once ?
    // if mutations|updates present, to get actual|latest data ?
    "fields": () => ({
      "donor": {
        "type": donor_Type,
        // `args` describes
        // the 'arguments' that this 'query' *accepts*
        "args": {
          "id": { "type": GraphQLString }
        },
        // The `resolve function` *describes*
        // how to "resolve" or *fulfill*
        // the _incoming_ `query`.
        "resolve": (_, args) => donors[args.id]
      },
      donors: {
        type: new GraphQLList(donor_Type),
        description: "List of all current donors by Blood Type",
        /**/
        args: {
          blood: {type: Blood_Type}
        },
        /**/
        //SyntaxError: Unexpected token {
        //resolve: function(source, {blood}) {
        /*
        Object.getOwnPropertyNames(obj).forEach(function(val, idx, array) {
          console.log(val + ' -> ' + obj[val]);
        });
        */
        /**/
        // what are the arguments ? source|1-st ?
        //resolve: (parent, args, ast) => {}
        //source: any,
        //args: { [key: string]: any },
        //info: GraphQLResolveInfo
        //http://localhost:3000/graphql?query={donors(blood:A_positive){id,Blood_Group}}
        // this work|filter records
        resolve: (source, args) => {
        // 'this' context does not matter
        //resolve: function(source, args) {
          // !!! WTF !!! //
          //source = donors;
          // check props existence
          if (args.blood) {
          //if (args["blood"]) {
          //if (args) {
            // values(o).filter((i)=>(i['1']=='a')) <- for digits|numerical keys
            // values(o).filter((i)=>(i.b=='a')) <- for string keys
            // "values is not defined" <- in node ?
            //return values(source).filter((d) => d.Blood_Group === args.blood);
            //Object.getOwnPropertyNames(o).filter((k)=>(o[k].b=='a')).map((k) => o[k])
            //"Cannot convert undefined or null to object"
            return Object.getOwnPropertyNames(source).filter((k) => source[k].Blood_Group === args.blood).map((k) => source[k]);
          } else {
            //return values(donors);
            //"Cannot convert undefined or null to object"
            return Object.getOwnPropertyNames(source).map((k) => source[k]);
          }
        }
        /**/
        //resolve: (source) => source
        //resolve: () => (values(donors))
        //"Expected Iterable, but did not find one for field Donors_Query.donors."
        //resolve: () => donors
        //http://localhost:3000/graphql?query={donors{id,Blood_Group}}
        // get all records with specified view fields (like in MongoDB, except no default ID field)
        //resolve: () => Object.getOwnPropertyNames(donors).map((k) => donors[k])
        //http://localhost:3000/graphql?query={donors{id}}
        // return 5 records of {"id": null}
        //resolve: () => ([1, 2, 3, '4', "five"])
      }
    })
  })
});
/*
const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
// if stored in|as separate module|file
export default Schema;
*/

//### server starts|unit test ###//
express()
  // Mounts the specified middleware function or functions
  // at the specified path.
  .use(
    '/graphql',
    graphqlHTTP({
      schema: schema,
      pretty: true, // <- JSON response output format ?
      /*
      parameter: source for|from 'resolve'
      For a Query type, this is
      the `rootValue`
      that you pass in
      when starting your server.
      */
      rootValue: donors// <- default context for 'resolve'
    })
  )
  .listen(3000);

console.log('GraphQL server running on http://localhost:3000/graphql');
/*
listening for query(ies) shaped as:
  {user(id:"1"){name}} (whitespace is optional in GraphQL)
  {
    user(id: "1") {
      name
    }
  }
It can be send to server
via a GET request
with a URL query string:
  http://localhost:3000/graphql?query={user(id:"1"){name}}
the URL-encoded version:
  %7Buser(id:%221%22)%7Bname%7D%7D.
(One can URL-encode any string in JavaScript
with the global 'encodeURI' function.)
*/