<template>
  <ion-grid>
    <ion-row>
      <ion-col>
        <ion-item lines="none">
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-label>
                  <ion-skeleton-text
                    animated
                    style="width:75%"
                  ></ion-skeleton-text>
                  <ion-skeleton-text
                    animated
                  ></ion-skeleton-text>
                </ion-label>
              </ion-col>
              
            </ion-row>
          </ion-grid>
        </ion-item>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-list>
                <ion-list-header>
                  <ion-label>
                    <ion-skeleton-text
                      animated
                      style="width:75%"
                    ></ion-skeleton-text>
                    <ion-skeleton-text
                      animated
                    ></ion-skeleton-text>
                  </ion-label>

                  <!-- <ion-label class="ion-text-end ion-margin-end">
                    <ion-skeleton-text
                      animated
                      style="width:50%"
                    ></ion-skeleton-text>
                    <ion-skeleton-text
                      animated
                      style="width:50%"
                    ></ion-skeleton-text>
                  </ion-label> -->
                </ion-list-header>

                <ion-card>
                  <ion-card-header>
                    <ion-card-title>
                      <ion-skeleton-text
                        animated
                        style="width:50%"
                      ></ion-skeleton-text>
                    </ion-card-title>
                  </ion-card-header>

                  <ion-card-content class="ion-no-padding ion-no-margin">
                    <ion-item lines="none">
                      <ion-grid>
                        <ion-row>
                          <ion-col>
                            <ion-label>
                              <ion-skeleton-text
                                animated
                              ></ion-skeleton-text>
                            </ion-label>
                          </ion-col>
                          <ion-col>
                            <ion-label class="ion-text-end" readonly>
                              <ion-skeleton-text
                                animated
                              ></ion-skeleton-text>
                            </ion-label>
                          </ion-col>
                        </ion-row>
                      </ion-grid>
                    </ion-item>

                    <ion-item lines="none">
                      <ion-grid>
                        <ion-row>
                          <ion-col>
                            <ion-label>
                              <ion-skeleton-text
                                animated
                              ></ion-skeleton-text>
                            </ion-label>
                          </ion-col>
                          <ion-col class="ion-text-end">
                            <ion-label>
                              <ion-skeleton-text
                                animated
                                style="width:50%"
                              ></ion-skeleton-text>
                              <ion-skeleton-text
                                animated
                              ></ion-skeleton-text>
                            </ion-label>
                          </ion-col>
                        </ion-row>
                      </ion-grid>
                    </ion-item>

                    <ion-item lines="none">
                      <ion-grid>
                        <ion-row>
                          <ion-col>
                            <ion-label>
                              <ion-skeleton-text
                                animated
                                style="width:50%"
                              ></ion-skeleton-text>
                            </ion-label>
                          </ion-col>
                          <ion-col class="ion-text-end">
                            <ion-label>
                              <ion-skeleton-text
                                animated
                                style="width:50%"
                              ></ion-skeleton-text>
                            </ion-label>
                          </ion-col>
                        </ion-row>
                      </ion-grid>
                    </ion-item>

                    <ion-item lines="none">
                      <ion-grid>
                        <ion-row>
                          <ion-col>
                            <ion-label>
                              <ion-skeleton-text
                                animated
                                style="width:50%"
                              ></ion-skeleton-text>
                            </ion-label>
                          </ion-col>
                          <ion-col>
                            <ion-item lines="none" class="ion-text-end">
                              <ion-label>
                                <ion-skeleton-text
                                  animated
                                  style="width:75%"
                                ></ion-skeleton-text>
                              </ion-label>
                            </ion-item>
                            <ion-item lines="none" class="ion-text-end">
                              <ion-label>
                                <ion-skeleton-text
                                  animated
                                  style="width:75%"
                                ></ion-skeleton-text>
                              </ion-label>
                            </ion-item>
                            <ion-item lines="none" class="ion-text-end">
                              <ion-label>
                                <ion-skeleton-text
                                  animated
                                  style="width:75%"
                                ></ion-skeleton-text>
                              </ion-label>
                            </ion-item>
                          </ion-col>
                        </ion-row>
                        
                      </ion-grid>
                    </ion-item>
                    <ion-item lines="none">
                      <ion-grid>
                        
                        <ion-row>
                          <ion-col>
                            <ion-item lines="none">
                              <ion-label class="ion-text-end">
                                <ion-skeleton-text
                                  animated
                                ></ion-skeleton-text>
                              </ion-label>
                            </ion-item>
                          </ion-col>
                        </ion-row>
                      </ion-grid>
                    </ion-item>
                  </ion-card-content>
                </ion-card>
              </ion-list>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script>
import {
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSkeletonText,
} from "@ionic/vue";
export default {
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSkeletonText,
  },
};
</script>

<style>
ion-skeleton-text {
  --background: var(--ion-color-primary);
  --background-rgb: var(--ion-color-primary-rgb);
}
</style>
