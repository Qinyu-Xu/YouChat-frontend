import {MD5} from 'crypto-js';

/* format json into url parameters */
export const formatParams = (params: any) => {
    return Object.keys(params)
        .map((key) => key + "=" + encodeURIComponent(params[key]))
        .join("&");
};

export const fileToBase64 = async (file: any) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

export const avatarToBase64 = async (file: any) => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const MAX_SIZE = 100 * 1024; // 100K
                let width = img.width;
                let height = img.height;
                let scale = 1;
                const imgSizes = img.sizes;

                canvas.width = width;
                canvas.height = height;

                ctx!.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL('image/jpeg'));
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};


export function readSvgAsBase64(svgFilePath: any) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', svgFilePath, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if (xhr.status === 200) {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                reader.readAsDataURL(xhr.response);
            } else {
                reject(new Error(`Failed to load SVG file: ${xhr.statusText}`));
            }
        };
        xhr.onerror = (error) => {
            reject(error);
        };
        xhr.send();
    });
}

export const encryptParam = (password: any) => {
    return MD5(password).toString();
};

export const DEFAULT_SVG = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiP' +
    'z48c3ZnIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj' +
    '48cGF0aCBkPSJNMjkuMzQ0NCAzMC40NzY1QzMxLjc0ODEgMjkuOTc3IDMzLjkyOTIgMjkuMTEwOCAzNS42MjQ3IDI3LjgzOTF' +
    'DMzguNTIwMiAyNS42Njc2IDQwIDIyLjMxMzYgNDAgMTguOTk5OUM0MCAxNi42NzUyIDM5LjExODcgMTQuNTA1IDM3LjU5Mjkg' +
    'MTIuNjY2OEMzNi43NDI3IDExLjY0MjUgMzkuMjI5NSAzLjk5OTg5IDM3LjAyIDUuMDI5MTlDMzQuODEwNSA2LjA1ODQ4IDMxL' +
    'jU3MDggOC4zMzY3OSAyOS44NzI2IDcuODMzOThDMjguMDU0NSA3LjI5NTY1IDI2LjA3MzMgNi45OTk4OSAyNCA2Ljk5OTg5Qz' +
    'IyLjE5OTIgNi45OTk4OSAyMC40Njc5IDcuMjIzMDEgMTguODUyNiA3LjYzNDRDMTYuNTA0NiA4LjIzMjM3IDE0LjI1OTEgNS4' +
    '5OTk4OSAxMiA1LjAyOTE5QzkuNzQwODYgNC4wNTg0OCAxMC45NzM2IDExLjk2MzIgMTAuMzAyNiAxMi43OTQ0QzguODQxMTkg' +
    'MTQuNjA1MSA4IDE2LjcyODggOCAxOC45OTk5QzggMjIuMzEzNiA5Ljc5MDg2IDI1LjY2NzYgMTIuNjg2MyAyNy44MzkxQzE0L' +
    'jYxNTEgMjkuMjg1NyAxNy4wMzQgMzAuMjA3NiAxOS43NDAxIDMwLjY2MTkiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZH' +
    'RoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMTkuNzM5NyAzMC42NjE5QzE4LjU4MTIgMzEuOTM3IDE' +
    '4LjAwMiAzMy4xNDc4IDE4LjAwMiAzNC4yOTQ0QzE4LjAwMiAzNS40NDEgMTguMDAyIDM4LjM0NjQgMTguMDAyIDQzLjAxMDYi' +
    'IHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjkuM' +
    'zQ0NiAzMC40NzY2QzMwLjQ0MjMgMzEuOTE3NCAzMC45OTEyIDMzLjIxMSAzMC45OTEyIDM0LjM1NzZDMzAuOTkxMiAzNS41MD' +
    'QyIDMwLjk5MTIgMzguMzg4NSAzMC45OTEyIDQzLjAxMDciIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJ' +
    'va2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNNiAzMS4yMTU1QzYuODk4ODcgMzEuMzI1NCA3LjU2NTU0IDMxLjczODcg' +
    'OCAzMi40NTU0QzguNjUxNjkgMzMuNTMwMyAxMS4wNzQyIDM3LjUxOCAxMy44MjUxIDM3LjUxOEMxNS42NTkxIDM3LjUxOCAxN' +
    'y4wNTE1IDM3LjUxOCAxOC4wMDI0IDM3LjUxOCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW' +
    '5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==';