
            <Container>
            <Paper>
              <form autoComplete="on" onSubmit={this.handleFormSubmit}>
                <Grid container 
                  direction="row" 
                  justify="center" 
                  alignItems="center" 
                  spacing={1}
                >
                  <Grid item>
                    <UserFormField
                      var="email"
                      label="Email"
                      autoComplete="email"
                      autoFocus={true}
                      stateVar={this.state.email}
                      onChange={this.handleInputChange}
                    />
                  </Grid>
                  <Grid item>
                    <UserFormField
                      var="apiKey"
                      label="API Key"
                      stateVar={this.state.apiKey}
                      onChange={this.handleInputChange}
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="rememberMe"
                          name="rememberMe"
                          checked={this.state.rememberMe}
                          onChange={this.handleCheck}
                          color="primary"
                        />
                      }
                      label="Remeber Me"
                    />
                  </Grid>
                </Grid>
                <Grid container 
                  direction="row" 
                  justify="center" 
                  alignItems="center" 
                  spacing={1}
                >
                  <Grid item lg={1}>
                    <UserFormField
                      var="lat"
                      label="Latitude"
                      stateVar={this.state.lat}
                      onChange={this.handleInputChange}
                    />
                  </Grid>
                  <Grid item lg={1}>
                    <UserFormField
                      var="lon"
                      label="Longitude"
                      stateVar={this.state.lon}
                      onChange={this.handleInputChange}
                    />
                  </Grid>
                  <Grid item>
                    <UserFormField
                      var="distance"
                      label="Distance (miles)"
                      stateVar={this.state.distance}
                      onChange={this.handleInputChange}
                    />
                  </Grid>
                  <Grid item>
                    <UserFormField
                      var="maxResults"
                      label="Results To Find"
                      stateVar={this.state.maxResults}
                      onChange={this.handleInputChange}
                    />
                  </Grid>
                </Grid>

                <Grid container 
                  direction="row" 
                  justify="center" 
                  alignItems="center" 
                  spacing={1}
                >
                  <Grid item>
                    <Button
                      className={classes.button}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
            </Container>
