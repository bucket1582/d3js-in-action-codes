import html2canvas from "html2canvas";

const wait = async (sec) => new Promise(res => setTimeout(res, sec * 1000));

const save_html = async () => {
    await wait(5);
    html2canvas(document.getElementsByClassName("container")[0], {backgroundColor: "#ffffff"}).then((canvas) => {
        const link = document.createElement('a');
        const uri = canvas.toDataURL("image/png");

        document.body.appendChild(link);

        link.href = uri;
        link.download = "plot.png";
        link.click();

        document.body.removeChild(link);
    });
}

save_html();