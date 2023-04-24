/* format json into url parameters */
export const formatParams = (params: any) => {
    return Object.keys(params)
        .map((key) => key + "=" + encodeURIComponent(params[key]))
        .join("&");
};

export function getRandomNumber(min: number, max: number) {
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    if(number >= 1 && number <= 9) return "0" + number.toString();
    else return number.toString();
}

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