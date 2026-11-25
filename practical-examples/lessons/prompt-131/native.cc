#include <napi.h>
Napi::Value Twice(const Napi::CallbackInfo& info){Napi::Env env=info.Env();if(info.Length()!=1||!info[0].IsNumber()){Napi::TypeError::New(env,"Expected one number").ThrowAsJavaScriptException();return env.Undefined();}return Napi::Number::New(env,info[0].As<Napi::Number>().DoubleValue()*2);}
Napi::Object Init(Napi::Env env,Napi::Object exports){exports.Set("twice",Napi::Function::New(env,Twice));return exports;}
NODE_API_MODULE(addon,Init)
