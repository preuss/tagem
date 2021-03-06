/*
Copyright 2020 Adam Gray
This file is part of the tagem program.
The tagem program is free software: you can redistribute it and/or
modify it under the terms of the GNU General Public License as published by the
Free Software Foundation version 3 of the License.
The tagem program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
This copyright notice should be included in any copy or substantial copy of the tagem source code.
The absense of this copyright notices on some other files in this project does not indicate that those files do not also fall under this license, unless they have a different license written at the top of the file.
*/
#pragma once


#include <cstdio> // for fprintf, fget


namespace cli {


namespace flag {
	struct ArgSeparator{};
} // namespace flag


void print_opt(const char* const opt){
	fprintf(stderr,  "  %s\n",  opt);
}


void print_opts(){}


template<typename... Args>
void print_opts(const char* const opt,  Args... args){
	print_opt(opt);
	print_opts(args...);
}


void read_into(char* itr){
	char c;
	while((c = fgetc(stdin))){
		if (c == '\n'){
			*itr = 0;
			break;
		}
		*(itr++) = c;
	}
}


template<int indx>
int compare_to_opts(const char* itr){
	return -1;
}


template<int indx,  typename... Args>
int compare_to_opts(const char* itr,  const char* opt,  Args... args){
	while(*itr == *opt){
		if (*itr == 0)
			return indx;
	}
	return compare_to_opts<indx + 1>(itr, args...);
}


template<typename... Args,  typename... Opts>
int get_which(char* buf,  const char* const prompt_fmt,  const char* const printf_arg,  const flag::ArgSeparator f,  Opts... opts){
/*template<typename... Args,  typename... Opts>
int get_which(const char* const prompt_fmt,  Args... printf_args,  const flag::ArgSeparator f,  Opts... opts){
	Doesn't work, and can't be bothered to write the 1000 lines of boilerplate code needed to trick the compiler into making it work.
*/
	while(true){
		fprintf(stderr,  prompt_fmt,  printf_arg);
		
		print_opts(opts...);
		
		read_into(buf);
		
		const int i = compare_to_opts<0>(buf, opts...);
		if (i != -1)
			return i;
	}
}


template<typename... Args>
char* get_trim(char* buf,  const char* const trim_from,  const char* const prompt_fmt,  Args... printf_args){
	while(true){
		fprintf(stderr,  prompt_fmt,  printf_args...);
		
		print_opt(trim_from);
		
		read_into(buf);
		
		return buf;
	}
}


} // namespace cli
