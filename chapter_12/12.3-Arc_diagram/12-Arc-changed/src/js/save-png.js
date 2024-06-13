import html2canvas from "html2canvas";

html2canvas(document.getElementsByClassName("container")[0], {backgroundColor: "#ffffff"}).then((canvas) => {
    const link = document.createElement('a');
    const uri = canvas.toDataURL("image/png");

    document.body.appendChild(link);

    link.href = uri;
    link.download = "plot.png";
    link.click();

    document.body.removeChild(link);
});