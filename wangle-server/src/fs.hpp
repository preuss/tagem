#pragma once

bool is_not_file_or_dir_of_interest(const char* const name){
	return (
		(name == nullptr) ||
		(
			(name[0] == '.') &&
			(
				(name[1] == 0) ||
				((name[1] == '.') && (name[2] == 0))
			)
		)
	);
}

bool file_exists(const char* const path){
	FILE* const f = fopen(path, "rb");
	if (f == nullptr)
		return false;
	fclose(f);
	return true;
}
