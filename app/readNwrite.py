def read_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    return content


def write_file(filename, contents, mode="wt"):
    with open(filename, mode, encoding="utf-8") as fout:
        fout.write(contents)
