# csvreader.js
It's, or at least aims to be, a simple lightweight lib to parse a string containing the csv itself to a structure you can query by row, column or coordinate.
It's simple (yet powerful and flexible?), and it means it fits simple needs such as csv files with/without headers, without quotes, without comments and without escape sequences.
It can be used in the browser or in nodejs without any change.

## Usage
````javascript
var separator = ",",
	mode = "rows", //"rows" or "cols"
	datatype = "int",
	input = "0,-489\n1,-485",
	has_headers = false,
	reader, csv, item, teststr, testint;

reader =  new csvreader.Reader(separator,mode).as(datatype);
csv = reader.Load(input,has_headers);
item = csv.get(0,1);

teststr = item === "-489"; //false!
testint = item === -489; //true!
````

## Documentation

````javascript
csvreader.Reader(separator,mode)
````
has default datatype "string", no need for .as("string")

````javascript
csv.get(0,1);
````
will return row 0, col 1 when csv is loaded in mode "rows", or col 0, row 1 when csv is loaded in mode "cols".
`csv.content[0]` represents the first column of the csv file in "cols" mode.
`csv.content[0]` represents the first row of the csv file in "cols" mode.
When using `has_headers = true` you can query using column name, for example:
````javascript
csv.get(0,"colA"); //"rows" mode
csv.get("colA",0); //"cols" mode
````

## Nodejs
To use the reader in nodejs nothing special is needed just require the lib, for example:
````javascript
require('./csvreader.js');
var input = "0,-489\n1,-485";
var reader =  new csvreader.Reader(",","rows");
var csv = reader.Load(input,false);
var result = csv.get(0,1);
````
## Future
- Add support to use `.as(function)` to create custom parsers. (very little changes required).
- Add support to use  `csv.to("rows")` and  `csv.to("cols")` to change the mode.

## License
As far as it's useful for you use it and modify it to fit your project, if you like it please drop a line to @xexuDj on twitter!
Christian Córdoba