import axios from "axios";
import querystring from "querystring";

const ANSWERS_ENDPOINT = "https://api.grepper.com/v1/answers";

class Errors {
    public static API_KEY_MISSING = "Grepper API key not found";
    public static QUERY_EMPTY = "Query is empty";
    public static SIMILARITY_INVALID = "Similarity is invalid (1-100 where 1 is really loose matching and 100 is really strict/tight match)";
    public static ANSWER_ID_INVALID = "Answer ID is invalid";
}

export default class Grepper {
    private static _apiKey: string;

    /**
     * Setter for the API Key
     * @example
     * import {apiKey} from "grepper-node"
     * apiKey = "your_api_key"
     * @param {string} value - The API key
     */
    public static set apiKey(value: string) {
        this._apiKey = value;
    }

    /**
     * Throws an error if the API key is missing
     * @private
     */
    private static validateApiKey() {
        if (!Grepper.apiKey) {
            throw new Error(Errors.API_KEY_MISSING);
        }
    }

    /**
     * Throws an error if the answer ID is missing or an invalid number
     * @param {number} id - The answer ID
     * @private
     */
    private static validateAnswerId(id: number) {
        if (!id || isNaN(id) || id <= 0) {
            throw new Error(Errors.ANSWER_ID_INVALID);
        }
    }

    /**
     * Throws an error if an HTTP status code other than 200 was returned by Grepper
     * @param {number} statusCode - The HTTP response status code
     * @private
     */
    private static validateStatusCode(statusCode: number) {
        switch (statusCode) {
            case 200:
                break;
            case 400:
                throw new Error("Bad Request -- Your request is invalid.");
            case 401:
                throw new Error("Unauthorized -- Your API key is wrong.");
            case 403:
                throw new Error("Forbidden -- You do not have access to the requested resource.");
            case 404:
                throw new Error("Not Found -- The specified enpoint could not be found.");
            case 405:
                throw new Error("Method Not Allowed -- You tried to access an enpoint with an invalid method.");
            case 429:
                throw new Error("Too Many Requests -- You're making too many requests! Slow down!");
            case 500:
                throw new Error("Internal Server Error -- We had a problem with our server. Try again later.");
            case 503:
                throw new Error("Service Unavailable -- We're temporarily offline for maintenance. Please try again later.");
            default:
                throw new Error(`Grepper returned status code ${statusCode}`);
        }
    }

    /**
     * This endpoint searches all answers based on a query.
     * @param {string} query - query to search through answer titles ex: "Javascript loop array backwords"
     * @param {number} [similarity=60] - How similar the query has to be to the answer title. 1-100 where 1 is really loose matching and 100 is really strict/tight match.
     */
    public static async search(query: string, similarity: number | undefined = 60) {
        Grepper.validateApiKey();

        if (!query) {
            throw new Error(Errors.QUERY_EMPTY);
        }

        if (similarity < 1 || similarity > 100) {
            throw new Error(Errors.SIMILARITY_INVALID);
        }

        const config = {
            url: `${ANSWERS_ENDPOINT}/search`,
            method: "GET",
            auth: {
                username: Grepper._apiKey,
                password: "",
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            params: {
                query,
                similarity,
            },
        };

        const response = await axios.request<GrepperSearchResponse>(config);

        Grepper.validateStatusCode(response.status);

        const answers = [
            ...response.data.data,
        ];

        for (const answer of answers) {
            try {
                answer.content = JSON.parse(answer.content);
            } catch (error) {
            }
        }

        return answers;
    }

    /**
     * This endpoint retrieves a specific answer.
     * @param {number} id - The answer id of the answer to retrieve
     */
    public static async retrieve(id: number) {
        Grepper.validateApiKey();
        Grepper.validateAnswerId(id);

        const config = {
            url: `${ANSWERS_ENDPOINT}/${id}`,
            method: "GET",
            auth: {
                username: Grepper._apiKey,
                password: "",
            },
        };

        const response = await axios.request<GrepperAnswer>(config);

        Grepper.validateStatusCode(response.status);

        const answer = response.data;

        try {
            answer.content = JSON.parse(answer.content);
        } catch (error) {
        }

        return answer;
    }

    /**
     * This endpoint updates a specific answer.
     * @param {number} id - The answer id of the answer to update
     * @param {string} content - The new content of the answer
     */
    public static async update(id: number, content: string) {
        Grepper.validateApiKey();
        Grepper.validateAnswerId(id);

        const config = {
            url: `${ANSWERS_ENDPOINT}/${id}`,
            method: "POST",
            auth: {
                username: Grepper._apiKey,
                password: "",
            },
            data: querystring.stringify({
                "answer[content]": content,
            }),
        };

        const response = await axios.request<GrepperUpdateResponse>(config);

        Grepper.validateStatusCode(response.status);

        return response.data;
    }
}
