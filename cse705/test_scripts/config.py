useOriginal = 2
baseURL = "https://prachip23.github.io"
#baseURL = "http://127.0.0.1:8080"

def getConfig():
  if useOriginal == 1:
    return baseURL + "/original/Y40_80.html";
  else:
    return baseURL + "/modified/Y40_80.html";

    
