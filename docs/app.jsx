<App>
  <CallingProvider>
    <CallProvider>
      <GroupCall>
          <Stack>
              <Header>
                  <Button></Button>
              </Header>
              <
          </Stack>
      </GroupCall>
    </CallProvider>
  </CallingProvider>
</App>


=========== new ====

<App>
    <GroupCall>
        <Stack>
            <Header>
                <Stack>
                    <Pivot>
                        <PivotItem>
                            <Icon></Icon>
                        </PivotItem>
                    </Pivot>
                    <MediaControls>
                        <Stack>
                            <CommandButton>
                                <Icon></Icon>
                            </CommandButton>
                        </Stack>
                    </MediaControls>
                </Stack>
            </Header>
            <Stack>
                <MediaGallery>
                    <GridLayoutComponent>
                        <Stack>
                            <LocalGridLayoutTileWithData>

                            </LocalGridLayoutTileWithData>
                        </Stack>
                        <Stack>
                            <RemoteGridLayoutTileWithData>
                                <ErrorBoundary>
                                    <MediaGalleryTileComponentBase>
                                        <Stack>
                                            <StreamMediaComponent>
                                                <div>
                                                    <video src="{mediaStream}"></video>
                                                </div>
                                            </StreamMediaComponent>
                                            <Stack>
                                                <Persona text="Bob" imageUrl="bob.png"/>
                                            </Stack>
                                        </Stack>
                                    </MediaGalleryTileComponentBase>
                                </ErrorBoundary>
                            </RemoteGridLayoutTileWithData>
                        </Stack>
                    </GridLayoutComponent>
                </MediaGallery>
                <CommandPanel>

                </CommandPanel>
            </Stack>
        </Stack>
    </GroupCall>
</App>