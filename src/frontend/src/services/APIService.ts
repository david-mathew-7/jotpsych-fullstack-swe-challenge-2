class APIService {
  private static instance: APIService;
  private baseUrl: string;
  private appVersion: string;

  private constructor() {
    this.baseUrl = "http://localhost:3002";
    this.appVersion = "1.0.0";
  }

  public static   getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  public async request(
    endpoint: string,
    method: string,
    body?: any,
    auth: boolean = false,
    multipart: boolean = false
  ): Promise<any> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "app-version": this.appVersion,
    };

    if (auth) {
      let token = localStorage.getItem("token");
      if (token) {
        if (multipart) {
          headers['Content-Type']= 'multipart/form-data'
        }
        headers["Authorization"] = `Bearer ${token}`; 
      }
    }

    let body_type = body;

    if (multipart){
      body_type = body;
    }

    else {
      body_type = body ? JSON.stringify(body) : null;
    }
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body_type
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  }
}

export default APIService.getInstance();
