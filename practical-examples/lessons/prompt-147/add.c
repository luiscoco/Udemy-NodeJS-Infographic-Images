#include <stdint.h>
#if defined(_WIN32)
#define EXPORT __declspec(dllexport)
#else
#define EXPORT
#endif
EXPORT int32_t add_i32(int32_t a,int32_t b){return a+b;}
