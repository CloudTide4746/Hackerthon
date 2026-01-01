/** @format */

import axios from "axios";

// API 基础地址
const API_BASE_URL = "http://10.60.185.80:8000";

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 20秒超时
});

/**
 * 将 Data URL (Base64) 转换为 Blob 对象
 * @param {string} dataURL - 图片的 Base64 字符串
 * @returns {Blob} - 转换后的 Blob 对象
 */
export const dataURLtoBlob = (dataURL) => {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * 上传图片到后端
 * 对应 Swagger: upload_image_upload_post
 * 假设路径为 /upload，字段名为 file
 *
 * @param {Blob | File} imageFile - 要上传的图片文件或 Blob
 * @returns {Promise<any>} - 后端响应数据
 */
export const uploadImage = async (
  imageFile,
  mode,
  sent_Prompt,
  usermessage
) => {
  try {
    const formData = new FormData();
    // <div className="md:"></div>
    // 注意：这里的 'file' 必须与后端接收的字段名一致
    // FastAPI 默认 UploadFile 参数名通常为 file，但也可能不同
    formData.append("file", imageFile, "screenshot.jpg");
    formData.append("mode", mode || "general-explainer");
    formData.append("sent_Prompt", sent_Prompt || "请分析这张图片");
    formData.append(
      "if_ask",
      usermessage && usermessage.trim() !== "" ? "1" : "0"
    );
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    // 假设 API 路径为 /upload
    // 如果实际路径不同，请在此处修改
    const response = await apiClient.post("/upload", formData);
    //如果成功，控制台输出"Backend Response Received"
    console.log("Backend Response Received:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error (uploadImage):", error);
    // 可以根据需要抛出错误或返回 null
    throw error;
  }
};

export default {
  uploadImage,
  dataURLtoBlob,
};
