import { Global } from "../../../../core/Global";
import { Command } from "../../Command";

/**
 * Stricp save command class.
 * 格式：命令类型 filename
 */
class SceneStricpSaveCom extends Command {
  static link: HTMLAnchorElement = null;
  async exec() {
    let str = this._text;
    let paras = str.split(' ');
    let records = Global.comExector.records;

    let filename = 'Stricp_' + new Date().toLocaleString() + '.fg.txt';
    filename = filename.replace(/[\/\\:*?"<>|]/g, '_'); // 替换非法字符
    if (Global.filename) {
      filename = Global.filename.split('.')[0] + '.fg.txt';
    } else {
      Global.filename = filename;
    }
    this._text = paras[0] + ' ' + filename;
    // 触发 React 组件更新（通过自定义事件）
    window.dispatchEvent(new CustomEvent('filenameChanged', { detail: Global.filename }));
    // 检测是否支持 File System Access API
    if ('showSaveFilePicker' in window) {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'TXT Files',
          accept: { 'application/text': ['.fg.txt'] }
        }]
      });

      const writable = await handle.createWritable();
      await writable.write(records);
      await writable.close();

    } else {
      // 2. 创建一个 Blob 对象，它就像是文件数据
      const blob = new Blob(records, { type: 'application/txt' });
      // 3. 为这个 Blob 创建一个临时的 URL
      const url = URL.createObjectURL(blob);
      // 4. 创建一个隐藏的 <a> 标签，并设置下载属性
      if (!SceneStricpSaveCom.link) {
        SceneStricpSaveCom.link = document.createElement('a');
        document.body.appendChild(SceneStricpSaveCom.link);
      }
      let link = SceneStricpSaveCom.link;
      link.href = url;
      link.download = filename; // 指定下载的文件名

      // 5. 模拟点击下载
      link.click();
    }
    this.done();
  }
}
export { SceneStricpSaveCom }