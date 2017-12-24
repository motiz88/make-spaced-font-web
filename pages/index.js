import React from "react";
import PropTypes from "prop-types";
import Button from "material-ui/Button";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "material-ui/Dialog";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import withRoot from "../components/withRoot";
import Dropzone from "react-dropzone";
import Input from "material-ui/Input/Input";
import InputLabel from "material-ui/Input/InputLabel";
import FormGroup from "material-ui/Form/FormGroup";
import Paper from "material-ui/Paper/Paper";
import Grid from "material-ui/Grid/Grid";
import LinearProgress from "material-ui/Progress/LinearProgress";
import { colors } from "material-ui";
import Fade from "material-ui/transitions/Fade";
import CircularProgress from "material-ui/Progress/CircularProgress";
import FileSaver from "file-saver";
import path from "path";

const styles = {
  root: {
    textAlign: "center",
    paddingTop: 200
  }
};

class Index extends React.Component {
  state = {
    letterSpacing: "0.1em",
    fontGenerated: false,
    isSubmitting: false,
    generatedLetterSpacing: null,
    submittedFile: null
  };

  _handleFileDrop = acceptedFiles => {
    const reader = new FileReader();
    reader.onload = ({ target: { result } }) => {
      document.fonts.add(new FontFace("unspaced-input", result));
    };
    reader.readAsArrayBuffer(acceptedFiles[0]);
    this.setState({ file: acceptedFiles[0] });
  };

  _handleSubmitClick = async () => {
    this.setState({ isSubmitting: true, submittedFile: this.state.file });
    try {
      var data = new FormData();
      data.append("inputFile", this.state.file);
      const { letterSpacing } = this.state;
      data.append("letterSpacing", letterSpacing);

      const res = await fetch("/api/make-spaced-font", {
        method: "POST",
        body: data
      });
      const font = await res.clone().arrayBuffer();
      document.fonts.add(new FontFace("spaced-result", font));
      this.setState({
        fontGenerated: true,
        generatedBlob: await res.blob(),
        generatedLetterSpacing: letterSpacing
      });
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  _handleDownloadClick = async () => {
    const { name } = this.state.file;
    const ext = path.extname(name);
    FileSaver.saveAs(
      this.state.generatedBlob,
      path.basename(name, ext) + ".space" + ext
    );
  };

  _handleSpacingChange = ({ target: { value: letterSpacing } }) => {
    this.setState({ letterSpacing });
  };

  render() {
    const isProcessedReady =
      !this.state.isSubmitting &&
      this.state.fontGenerated &&
      this.state.letterSpacing === this.state.generatedLetterSpacing &&
      this.state.submittedFile === this.state.file;
    return (
      <div className={this.props.classes.root} style={{ padding: 80 }}>
        <style jsx>{`
          .title-wow {
            animation: much-spacing 2.5s 1 forwards
              cubic-bezier(0.445, 0.05, 0.55, 0.95);
            white-space: nowrap;
          }
          @keyframes much-spacing {
            0% {
              letter-spacing: 0;
            }
            15% {
              letter-spacing: -0.05;
            }
            50% {
              letter-spacing: 0.5em;
            }
            65% {
              letter-spacing: 0.55em;
            }
            100% {
              letter-spacing: 0em;
            }
          }
          .spaced-demo {
            overflow: scroll;
            font-family: spaced-result;
          }
          .css-mockup {
            overflow: scroll;
            font-family: unspaced-input;
            transition: letter-spacing 0.5s;
          }
        `}</style>
        <Grid container>
          <Grid item xs={12}>
            <Typography type="display1" gutterBottom>
              <span className="title-wow">make-spaced-font</span>
            </Typography>
            <Typography type="subheading" gutterBottom>
              DEMO
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper style={{ padding: 24 }}>
              <Dropzone
                onDrop={this._handleFileDrop}
                style={{ margin: "0 auto" }}
              >
                <Button raised color={this.state.file ? "" : "primary"}>
                  Select font (or drop here)
                </Button>
              </Dropzone>
              <div style={{ marginTop: 12 }}>
                <InputLabel>Letter spacing</InputLabel>{" "}
                <Input
                  onChange={this._handleSpacingChange}
                  value={this.state.letterSpacing}
                />
              </div>
              <div style={{ position: "relative", marginTop: 12 }}>
                <Button
                  raised
                  color="primary"
                  disabled={!(this.state.file && this.state.letterSpacing)}
                  onClick={this._handleSubmitClick}
                >
                  Process
                </Button>
                {this.state.isSubmitting ? (
                  <CircularProgress
                    size={24}
                    color="accent"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: -12,
                      marginLeft: -12
                    }}
                  />
                ) : null}
              </div>
              <Button
                disabled={!isProcessedReady}
                style={{ marginTop: 12 }}
                onClick={this._handleDownloadClick}
              >
                Download
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              style={{
                padding: 24,
                opacity: this.state.file ? 1 : 0.3,
                filter: this.state.file ? "" : "blur(1px)",
                transition: "opacity 0.5s, filter 0.5s"
              }}
            >
              <Typography type="subheading" style={{ marginBottom: 12 }}>
                CSS letter-spacing
              </Typography>
              <div
                className="css-mockup showcase-content"
                style={{
                  letterSpacing: this.state.letterSpacing
                }}
              >
                ABCDEFGHIJKLM
                <br />
                NOPQRSTUVWXYZ
                <br />
                abcdefghijklm
                <br />
                nopqrstuvwxyz
                <br />
                1234567890
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              className="showcase-container"
              style={{
                padding: 24,
                opacity: isProcessedReady ? 1 : 0.3,
                filter: isProcessedReady ? "" : "blur(1px)",
                transition: "opacity 0.5s, filter 0.5s"
              }}
            >
              <Typography type="subheading" style={{ marginBottom: 12 }}>
                Processed font
              </Typography>

              <div className="spaced-demo">
                ABCDEFGHIJKLM
                <br />
                NOPQRSTUVWXYZ
                <br />
                abcdefghijklm
                <br />
                nopqrstuvwxyz
                <br />
                1234567890
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(Index));
