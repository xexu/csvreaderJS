csvreader = {};
csvreader.Reader = function(separator, mode){
	this.mode = (mode == 'cols') ? mode : 'rows';
	this.separator = separator || ',';
	this.type = 'string';
	this.parser = undefined;
	this.as = function(type){
		if(typeof type === 'function') this.parser = type;
		else if(typeof type === 'string'){
			switch(type){
				case 'int':
					this.parser = function(x){
						if (isNaN(x)){
							return undefined;
						} else {
							return parseInt(x);
						}
					}
					break;
				case 'float':
					this.parser = function(x){
						if (isNaN(x)){
							return undefined;
						} else {
							return parseFloat(x);
						}
					}
					break;
				case 'string':
				default:
					this.parser = undefined;
					break;
			}
		}
		return this;
	}
	this.LoadOnRows = function(csv_string, has_headers){
		var headers = {},
			csv = [],
			mode = 'rows';
		has_headers = has_headers || false;
		var csv_body = csv_string.split('\n');
		if(has_headers){
			var csv_header = csv_body.splice(0,1);
			csv_header = csv_header[0].split(this.separator);
			for(var i = 0;i<csv_header.length;i++){
				headers[csv_header[i]] = i;
			}
		}
		for(var i = 0;i<csv_body.length;i++){
			var row = csv_body[i].split(this.separator);
			if(this.parser != undefined){
				for(var j = 0;j<row.length;j++){
					row[j] = this.parser(row[j]);
				}
			}
			csv.push(row);
		}
		return new csvreader.File(mode,csv,has_headers,headers);
	};
	this.LoadOnCols = function(csv_string, has_headers){
		var headers = {},
			csv = [],
			cols = 0,
			mode = 'cols';
		has_headers = has_headers || false;
		var csv_body = csv_string.split('\n');
		if(has_headers){
			var csv_header = csv_body.splice(0,1);
			csv_header = csv_header[0].split(this.separator);
			for(var i = 0;i<csv_header.length;i++){
				headers[csv_header[i]] = i;
			}
			cols = csv_header.length;
		} else {
			cols = csv_body[0].length;
		}
		for(var i = 0;i<cols;i++){
			csv.push([]);
		}
		for(var i = 0;i<csv_body.length;i++){
			var row = csv_body[i].split(this.separator);
			if(this.parser != undefined){
				for(var j = 0;j<cols;j++){
					csv[j].push(this.parser(row[j]));
				}
			} else {
				for(var j = 0;j<cols;j++){
					csv[j].push(row[j]);
				}
			}
		}
		return new csvreader.File(mode,csv,has_headers,headers);
	};
	this.Load = (this.mode == 'rows') ? this.LoadOnRows : this.LoadOnCols;
};
csvreader.File = function(mode, content, has_headers, headers){
	this.has_headers = has_headers;
	this.headers = (this.has_headers) ? headers : {};
	this.mode = mode;
	this.content = content;

	this.get = function(i,j){
		var index_i = i;
		var index_j = j;
		if(this.has_headers){
			if(this.mode == 'rows' && typeof j === 'string'){
				index_j = this.headers[j];
			} else if(this.mode == 'cols' && typeof i === 'string'){
				index_i = this.headers[i];
			}
		}
		if(index_i == undefined || index_j == undefined){
			return undefined;
		}
		try{
			var element = this.content[index_i][index_j];
			return element;
		} catch (e){
			return undefined;
		}
	};
};