#include <stdio.h>
int main(void){FILE *f=fopen("/fixtures/hello.txt","r");if(!f){perror("open");return 1;}char line[128];while(fgets(line,sizeof line,f))fputs(line,stdout);fclose(f);return 0;}
