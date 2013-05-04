module("load csv",{
	setup : function(){
		input_headers = "index;signal_value\n0;-489\n1;-485\n2;-483\n3;-482\n4;-463";
		input_noheaders = "0,-489\n1,-485\n2,-483\n3,-482\n4,-463";
	}
});
test("elements loaded with default params", function(){
	var reader =  new csvreader.Reader();
	var csv = reader.Load(input_noheaders,false);
	var c = 0;
	for(var i = 0;i<csv.content.length;i++){
		for(var j = 0;j<csv.content[i].length;j++){
			c++;
		}
	}
	equal(c, 10);
});
test("with headers", function(){
	var reader =  new csvreader.Reader(";","rows");
	var csv = reader.Load(input_headers,true);
	equal(csv.get(0,1), -489);
});
test("without headers", function(){
	var reader =  new csvreader.Reader(",","rows");
	var csv = reader.Load(input_noheaders,false);
	equal(csv.get(0,1), -489);
});
test("on rows", function(){
	var reader =  new csvreader.Reader(",","rows");
	var csv = reader.Load(input_noheaders,false);
	equal(csv.get(0,1), -489);
});
test("on cols", function(){
	var reader =  new csvreader.Reader(",","cols");
	var csv = reader.Load(input_noheaders,false);
	equal(csv.get(1,0), -489);
});
test("check rows/cols are the same element transposed", function(){
	var rreader =  new csvreader.Reader(",","rows");
	var rcsv = rreader.Load(input_noheaders,false);
	var creader =  new csvreader.Reader(",","cols");
	var ccsv = creader.Load(input_noheaders,false);
	deepEqual(rcsv.get(0,1),ccsv.get(1,0));
});



module("csv get cell",{
	setup : function(){
		input_headers = "index;signal_value\n0;-489\n1;-485\n2;-483\n3;-482\n4;-463";
		input_noheaders = "0,-489\n1,-485\n2,-483\n3,-482\n4,-463";
	}
});
test("by index on rows", function(){
	var reader =  new csvreader.Reader(";");
	var csv = reader.Load(input_headers,true);
	equal(csv.get(0,1), -489);
});
test("by index on cols", function(){
	var reader =  new csvreader.Reader(";","cols");
	var csv = reader.Load(input_headers,true);
	equal(csv.get(0,1), 1);
});
test("by header on rows", function(){
	var reader =  new csvreader.Reader(";");
	var csv = reader.Load(input_headers,true);
	equal(csv.get(0,"signal_value"), -489);
});
test("by header on cols", function(){
	var reader =  new csvreader.Reader(";","cols");
	var csv = reader.Load(input_headers,true);
	equal(csv.get("index",1), 1);
});
test("not found index and header", function(){
	var reader =  new csvreader.Reader(";","cols");
	var csv = reader.Load(input_headers,true);
	equal(csv.get("index2",1), undefined);
	equal(csv.get(-1,1), undefined);
});



module("separators");
test("comma", function(){
	var input = "0,-489\n1,-485\n2,-483\n3,-482\n4,-463";
	var reader =  new csvreader.Reader(",");
	var csv = reader.Load(input,false);
	equal(csv.get(0,1), -489);
});

test("semicolon", function(){
	var input = "0;-489\n1;-485\n2;-483\n3;-482\n4;-463";
	var reader =  new csvreader.Reader(";");
	var csv = reader.Load(input,false);
	equal(csv.get(0,1), -489);
});



module("data types (deepEqual tests)",{
	setup : function(){
		input_string = "a,b\nc,d\ne,f";
		input_int = "0,-489\n1,-485\n2,-483";
		input_float = "0.1,-489.675\n1.11,-485\n2,-483";
		str_reader = new csvreader.Reader(",","rows").as("string");
		int_reader = new csvreader.Reader(",","rows").as("int");
		float_reader = new csvreader.Reader(",","rows").as("float");
	}
});
test("string reader", function(){
	var csv = str_reader.Load(input_string,false);
	deepEqual(csv.get(0,0), "a");
	csv = str_reader.Load(input_int,false);
	deepEqual(csv.get(0,0), "0");
});
test("int reader", function(){
	var csv = int_reader.Load(input_int,false);
	deepEqual(csv.get(1,1), -485);
	csv = int_reader.Load(input_string,false);
	deepEqual(csv.get(1,1), undefined);
});
test("float reader", function(){
	var csv = float_reader.Load(input_float,false);
	deepEqual(csv.get(0,0), 0.1);
	deepEqual(csv.get(0,1), -489.675);
	deepEqual(csv.get(1,1), -485);
	deepEqual(csv.get(2,0), 2);
});