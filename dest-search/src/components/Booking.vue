<template>
  <div class="container is-max-widescreen">
    <div class="columns is-mobile" v-show="all_key_info_exists">
      <!-- Primary Guest & Payment Info -->
      <div class="column is-two-third" id="booking">
        <form id="bookingForm">
          <!-- Primary Guest -->
          <div class="box">
            <div class="columns is-mobile">
              <div class="column is-three-fifth">
                <h3 class="title is-3">Primary Guest</h3>
              </div>
              <div class="column is-two-fifth">
                <div class="block">
                  <b-field>
                    <div style="align-self: center">
                      Are you the primary guest?&nbsp;
                    </div>
                    <b-radio-button v-model="primaryGuestRadioButton" native-value="Nope"
                      type="is-danger is-light is-outlined" disabled>
                      <span>No</span>
                    </b-radio-button>

                    <b-radio-button v-model="primaryGuestRadioButton" native-value="Yes"
                      type="is-success is-light is-outlined" disabled>
                      <b-icon icon="check"></b-icon>
                      <span>Yes</span>
                    </b-radio-button>
                  </b-field>
                </div>
              </div>
            </div>

            <div class="columns is-mobile">
              <div class="column is-one-third">
                <b-field label="Title" :type="{ 'is-danger': Object.keys(title_error).length > 0 }"
                  :message="title_error">
                  <b-select v-model="title" placeholder="Title" expanded>
                    <option value="MR">Mr.</option>
                    <option value="MS">Ms.</option>
                    <option value="MRS">Mrs.</option>
                  </b-select>
                </b-field>
              </div>

              <div class="column is-one-third">
                <b-field label="First name" class="input-field" :type="{
                  'is-danger': Object.keys(first_name_error).length > 0,
                }" :message="first_name_error">
                  <b-input id="first_name_field" value="" maxlength="30" placeholder="John" v-model="first_name"></b-input>
                </b-field>
              </div>

              <div class="column is-one-third">
                <b-field label="Last name" class="input-field" :type="{
                  'is-danger': Object.keys(last_name_error).length > 0,
                }" :message="last_name_error">
                  <b-input id="last_name_field" value="" maxlength="30" placeholder="Doe" v-model="last_name"></b-input>
                </b-field>
              </div>
            </div>

            <div class="columns is-mobile">
              <div class="column is-one-third">
                <b-field label="Country code" :type="{
                  'is-danger':
                    Object.keys(countryCodeSelect_error).length > 0,
                }" :message="countryCodeSelect_error">
                  <b-select v-model="countryCodeSelect" placeholder="Country code" expanded>
                    <option value="Afghanistan +93">Afghanistan +93</option>
                    <option value="Albania +355">Albania +355</option>
                    <option value="Algeria +213">Algeria +213</option>
                    <option value="American Samoa +1-684">
                      American Samoa +1-684
                    </option>
                    <option value="Andorra +376">Andorra +376</option>
                    <option value="Angola +244">Angola +244</option>
                    <option value="Anguilla +1-264">Anguilla +1-264</option>
                    <option value="Antarctica +672">Antarctica +672</option>
                    <option value="Antigua +1-268">Antigua +1-268</option>
                    <option value="Argentina +54">Argentina +54</option>
                    <option value="Armenia +374">Armenia +374</option>
                    <option value="Aruba +297">Aruba +297</option>
                    <option value="Ascension +247">Ascension +247</option>
                    <option value="Australia +61">Australia +61</option>
                    <option value="Australian External Territories +672">
                      Australian External Territories +672
                    </option>
                    <option value="Austria +43">Austria +43</option>
                    <option value="Azerbaijan +994">Azerbaijan +994</option>
                    <option value="Bahamas +1-242">Bahamas +1-242</option>
                    <option value="Bahrain +973">Bahrain +973</option>
                    <option value="Bangladesh +880">Bangladesh +880</option>
                    <option value="Barbados +1-246">Barbados +1-246</option>
                    <option value="Barbuda +1-268">Barbuda +1-268</option>
                    <option value="Belarus +375">Belarus +375</option>
                    <option value="Belgium +32">Belgium +32</option>
                    <option value="Belize +501">Belize +501</option>
                    <option value="Benin +229">Benin +229</option>
                    <option value="Bermuda +1-441">Bermuda +1-441</option>
                    <option value="Bhutan +975">Bhutan +975</option>
                    <option value="Bolivia +591">Bolivia +591</option>
                    <option value="Bosnia & Herzegovina +387">
                      Bosnia & Herzegovina +387
                    </option>
                    <option value="Botswana +267">Botswana +267</option>
                    <option value="Brazil +55">Brazil +55</option>
                    <option value="British Virgin Islands +1-284">
                      British Virgin Islands +1-284
                    </option>
                    <option value="Brunei Darussalam +673">
                      Brunei Darussalam +673
                    </option>
                    <option value="Bulgaria +359">Bulgaria +359</option>
                    <option value="Burkina Faso +226">Burkina Faso +226</option>
                    <option value="Burundi +257">Burundi +257</option>
                    <option value="Cambodia +855">Cambodia +855</option>
                    <option value="Cameroon +237">Cameroon +237</option>
                    <option value="Canada +1">Canada +1</option>
                    <option value="Cape Verde Islands +238">
                      Cape Verde Islands +238
                    </option>
                    <option value="Cayman Islands +1-345">
                      Cayman Islands +1-345
                    </option>
                    <option value="Central African Republic +236">
                      Central African Republic +236
                    </option>
                    <option value="Chad +235">Chad +235</option>
                    <option value="Chatham Island (New Zealand) +64">
                      Chatham Island (New Zealand) +64
                    </option>
                    <option value="Chile +56">Chile +56</option>
                    <option value="China (PRC) +86">China (PRC) +86</option>
                    <option value="Christmas Island +61-8">
                      Christmas Island +61-8
                    </option>
                    <option value="Cocos-Keeling Islands +61">
                      Cocos-Keeling Islands +61
                    </option>
                    <option value="Colombia +57">Colombia +57</option>
                    <option value="Comoros +269">Comoros +269</option>
                    <option value="Congo +242">Congo +242</option>
                    <option value="Congo, Dem. Rep. of (former Zaire) +243">
                      Congo, Dem. Rep. of (former Zaire) +243
                    </option>
                    <option value="Cook Islands +682">Cook Islands +682</option>
                    <option value="Costa Rica +506">Costa Rica +506</option>
                    <option value="Côte d'Ivoire (Ivory Coast) +225">
                      Côte d'Ivoire (Ivory Coast) +225
                    </option>
                    <option value="Croatia +385">Croatia +385</option>
                    <option value="Cuba +53">Cuba +53</option>
                    <option value="Cuba (Guantanamo Bay) +5399">
                      Cuba (Guantanamo Bay) +5399
                    </option>
                    <option value="Curaçao +599">Curaçao +599</option>
                    <option value="Cyprus +357">Cyprus +357</option>
                    <option value="Czech Republic +420">
                      Czech Republic +420
                    </option>
                    <option value="Denmark +45">Denmark +45</option>
                    <option value="Diego Garcia +246">Diego Garcia +246</option>
                    <option value="Djibouti +253">Djibouti +253</option>
                    <option value="Dominica +1-767">Dominica +1-767</option>
                    <option value="Dominican Republic +1-809">
                      Dominican Republic +1-809
                    </option>
                    <option value="Dominican Republic +1-829">
                      Dominican Republic +1-829
                    </option>
                    <option value="East Timor +670">East Timor +670</option>
                    <option value="Easter Island +56">Easter Island +56</option>
                    <option value="Ecuador +593">Ecuador +593</option>
                    <option value="Egypt +20">Egypt +20</option>
                    <option value="El Salvador +503">El Salvador +503</option>
                    <option value="Ellipso (Mobile Satellite service) +8812">
                      Ellipso (Mobile Satellite service) +8812
                    </option>
                    <option value="Ellipso (Mobile Satellite service) +8813">
                      Ellipso (Mobile Satellite service) +8813
                    </option>
                    <option value="EMSAT (Mobile Satellite service) +88213">
                      EMSAT (Mobile Satellite service) +88213
                    </option>
                    <option value="Equatorial Guinea +240">
                      Equatorial Guinea +240
                    </option>
                    <option value="Eritrea +291">Eritrea +291</option>
                    <option value="Estonia +372">Estonia +372</option>
                    <option value="Ethiopia +251">Ethiopia +251</option>
                    <option value="Falkland Islands (Malvinas) +500">
                      Falkland Islands (Malvinas) +500
                    </option>
                    <option value="Faroe Islands +298">
                      Faroe Islands +298
                    </option>
                    <option value="Fiji Islands +679">Fiji Islands +679</option>
                    <option value="Finland +358">Finland +358</option>
                    <option value="France +33">France +33</option>
                    <option value="French Antilles +596">
                      French Antilles +596
                    </option>
                    <option value="French Guiana +594">
                      French Guiana +594
                    </option>
                    <option value="French Polynesia +689">
                      French Polynesia +689
                    </option>
                    <option value="Gabonese Republic +241">
                      Gabonese Republic +241
                    </option>
                    <option value="Gambia +220">Gambia +220</option>
                    <option value="Georgia +995">Georgia +995</option>
                    <option value="Germany +49">Germany +49</option>
                    <option value="Ghana +233">Ghana +233</option>
                    <option value="Gibraltar +350">Gibraltar +350</option>
                    <option value="Global Mobile Satellite System (GMSS) +881">
                      Global Mobile Satellite System (GMSS) +881
                    </option>
                    <option value="ICO Global +8810">ICO Global +8810</option>
                    <option value="ICO Global +8811">ICO Global +8811</option>
                    <option value="Ellipso 8812 +8813">
                      Ellipso 8812 +8813
                    </option>
                    <option value="Iridium 8816 +8817">
                      Iridium 8816 +8817
                    </option>
                    <option value="Globalstar +8818">Globalstar +8818</option>
                    <option value="Globalstar +8819">Globalstar +8819</option>
                    <option value="Greece +30">Greece +30</option>
                    <option value="Greenland +299">Greenland +299</option>
                    <option value="Grenada +1-473">Grenada +1-473</option>
                    <option value="Guadeloupe +590">Guadeloupe +590</option>
                    <option value="Guam +1-671">Guam +1-671</option>
                    <option value="Guantanamo Bay +5399">
                      Guantanamo Bay +5399
                    </option>
                    <option value="Guatemala +502">Guatemala +502</option>
                    <option value="Guinea-Bissau +245">
                      Guinea-Bissau +245
                    </option>
                    <option value="Guinea +224">Guinea +224</option>
                    <option value="Guyana +592">Guyana +592</option>
                    <option value="Haiti +509">Haiti +509</option>
                    <option value="Honduras +504">Honduras +504</option>
                    <option value="Hong Kong +852">Hong Kong +852</option>
                    <option value="Hungary +36">Hungary +36</option>
                    <option value="ICO Global (Mobile Satellite Service) +8810">
                      ICO Global (Mobile Satellite Service) +8810
                    </option>
                    <option value="ICO Global (Mobile Satellite Service) +8811">
                      ICO Global (Mobile Satellite Service) +8811
                    </option>
                    <option value="Iceland +354">Iceland +354</option>
                    <option value="India +91">India +91</option>
                    <option value="Indonesia +62">Indonesia +62</option>
                    <option value="Inmarsat (Atlantic Ocean - East) +871">
                      Inmarsat (Atlantic Ocean - East) +871
                    </option>
                    <option value="Inmarsat (Atlantic Ocean - West) +874">
                      Inmarsat (Atlantic Ocean - West) +874
                    </option>
                    <option value="Inmarsat (Indian Ocean) +873">
                      Inmarsat (Indian Ocean) +873
                    </option>
                    <option value="Inmarsat (Pacific Ocean) +872">
                      Inmarsat (Pacific Ocean) +872
                    </option>
                    <option value="Inmarsat SNAC +870">
                      Inmarsat SNAC +870
                    </option>
                    <option value="International Freephone Service +800">
                      International Freephone Service +800
                    </option>
                    <option value="International Shared Cost Service (ISCS) +808">
                      International Shared Cost Service (ISCS) +808
                    </option>
                    <option value="Iran +98">Iran +98</option>
                    <option value="Iraq +964">Iraq +964</option>
                    <option value="Ireland +353">Ireland +353</option>
                    <option value="Iridium (Mobile Satellite service) +8816">
                      Iridium (Mobile Satellite service) +8816
                    </option>
                    <option value="Iridium (Mobile Satellite service) +8817">
                      Iridium (Mobile Satellite service) +8817
                    </option>
                    <option value="Israel +972">Israel +972</option>
                    <option value="Italy +39">Italy +39</option>
                    <option value="Ivory Coast +225">Ivory Coast +225</option>
                    <option value="Jamaica +1-876">Jamaica +1-876</option>
                    <option value="Japan +81">Japan +81</option>
                    <option value="Jordan +962">Jordan +962</option>
                    <option value="Kazakhstan +7">Kazakhstan +7</option>
                    <option value="Kenya +254">Kenya +254</option>
                    <option value="Kiribati +686">Kiribati +686</option>
                    <option value="Korea (North) +850">
                      Korea (North) +850
                    </option>
                    <option value="Korea (South) +82">Korea (South) +82</option>
                    <option value="Kuwait +965">Kuwait +965</option>
                    <option value="Kyrgyz Republic +996">
                      Kyrgyz Republic +996
                    </option>
                    <option value="Laos +856">Laos +856</option>
                    <option value="Latvia +371">Latvia +371</option>
                    <option value="Lebanon +961">Lebanon +961</option>
                    <option value="Lesotho +266">Lesotho +266</option>
                    <option value="Liberia +231">Liberia +231</option>
                    <option value="Libya +218">Libya +218</option>
                    <option value="Liechtenstein +423">
                      Liechtenstein +423
                    </option>
                    <option value="Lithuania +370">Lithuania +370</option>
                    <option value="Luxembourg +352">Luxembourg +352</option>
                    <option value="Macao +853">Macao +853</option>
                    <option value="Macedonia (Former Yugoslav Rep of.) +389">
                      Macedonia (Former Yugoslav Rep of.) +389
                    </option>
                    <option value="Madagascar +261">Madagascar +261</option>
                    <option value="Malawi +265">Malawi +265</option>
                    <option value="Malaysia +60">Malaysia +60</option>
                    <option value="Maldives +960">Maldives +960</option>
                    <option value="Mali Republic +223">
                      Mali Republic +223
                    </option>
                    <option value="Malta +356">Malta +356</option>
                    <option value="Marshall Islands +692">
                      Marshall Islands +692
                    </option>
                    <option value="Martinique +596">Martinique +596</option>
                    <option value="Mauritania +222">Mauritania +222</option>
                    <option value="Mauritius +230">Mauritius +230</option>
                    <option value="Mayotte Island +269">
                      Mayotte Island +269
                    </option>
                    <option value="Mexico +52">Mexico +52</option>
                    <option value="Micronesia (Federal States of) +691">
                      Micronesia (Federal States of) +691
                    </option>
                    <option value="Midway Island +1-808">
                      Midway Island +1-808
                    </option>
                    <option value="Moldova +373">Moldova +373</option>
                    <option value="Monaco +377">Monaco +377</option>
                    <option value="Mongolia +976">Mongolia +976</option>
                    <option value="Montenegro +382">Montenegro +382</option>
                    <option value="Montserrat +1-664">Montserrat +1-664</option>
                    <option value="Morocco +212">Morocco +212</option>
                    <option value="Mozambique +258">Mozambique +258</option>
                    <option value="Myanmar +95">Myanmar +95</option>
                    <option value="Namibia +264">Namibia +264</option>
                    <option value="Nauru +674">Nauru +674</option>
                    <option value="Nepal +977">Nepal +977</option>
                    <option value="Netherlands +31">Netherlands +31</option>
                    <option value="Netherlands Antilles +599">
                      Netherlands Antilles +599
                    </option>
                    <option value="Nevis +1-869">Nevis +1-869</option>
                    <option value="New Caledonia +687">
                      New Caledonia +687
                    </option>
                    <option value="New Zealand +64">New Zealand +64</option>
                    <option value="Nicaragua +505">Nicaragua +505</option>
                    <option value="Niger +227">Niger +227</option>
                    <option value="Nigeria +234">Nigeria +234</option>
                    <option value="Niue +683">Niue +683</option>
                    <option value="Norfolk Island +672">
                      Norfolk Island +672
                    </option>
                    <option value="Northern Marianas Islands (Saipan, Rota & Tinian) +1-670">
                      Northern Marianas Islands (Saipan, Rota & Tinian) +1-670
                    </option>
                    <option value="Norway +47">Norway +47</option>
                    <option value="Oman +968">Oman +968</option>
                    <option value="Pakistan +92">Pakistan +92</option>
                    <option value="Palau +680">Palau +680</option>
                    <option value="Palestinian Settlements +970">
                      Palestinian Settlements +970
                    </option>
                    <option value="Panama +507">Panama +507</option>
                    <option value="Papua New Guinea +675">
                      Papua New Guinea +675
                    </option>
                    <option value="Paraguay +595">Paraguay +595</option>
                    <option value="Peru +51">Peru +51</option>
                    <option value="Philippines +63">Philippines +63</option>
                    <option value="Poland +48">Poland +48</option>
                    <option value="Portugal +351">Portugal +351</option>
                    <option value="Puerto Rico +1-787">
                      Puerto Rico +1-787
                    </option>
                    <option value="Puerto Rico +1-939">
                      Puerto Rico +1-939
                    </option>
                    <option value="Qatar +974">Qatar +974</option>
                    <option value="Réunion Island +262">
                      Réunion Island +262
                    </option>
                    <option value="Romania +40">Romania +40</option>
                    <option value="Russia +7">Russia +7</option>
                    <option value="Rwandese Republic +250">
                      Rwandese Republic +250
                    </option>
                    <option value="St. Helena +290">St. Helena +290</option>
                    <option value="St. Kitts/Nevis +1-869">
                      St. Kitts/Nevis +1-869
                    </option>
                    <option value="St. Lucia +1-758">St. Lucia +1-758</option>
                    <option value="St. Pierre & Miquelon +508">
                      St. Pierre & Miquelon +508
                    </option>
                    <option value="St. Vincent & Grenadines +1-784">
                      St. Vincent & Grenadines +1-784
                    </option>
                    <option value="Samoa +685">Samoa +685</option>
                    <option value="San Marino +378">San Marino +378</option>
                    <option value="São Tomé and Principe +239">
                      São Tomé and Principe +239
                    </option>
                    <option value="Saudi Arabia +966">Saudi Arabia +966</option>
                    <option value="Senegal +221">Senegal +221</option>
                    <option value="Serbia +381">Serbia +381</option>
                    <option value="Seychelles Republic +248">
                      Seychelles Republic +248
                    </option>
                    <option value="Sierra Leone +232">Sierra Leone +232</option>
                    <option value="Singapore +65" selected>
                      Singapore +65
                    </option>
                    <option value="Slovak Republic +421">
                      Slovak Republic +421
                    </option>
                    <option value="Slovenia +386">Slovenia +386</option>
                    <option value="Solomon Islands +677">
                      Solomon Islands +677
                    </option>
                    <option value="Somali Democratic Republic +252">
                      Somali Democratic Republic +252
                    </option>
                    <option value="South Africa +27">South Africa +27</option>
                    <option value="Spain +34">Spain +34</option>
                    <option value="Sri Lanka +94">Sri Lanka +94</option>
                    <option value="Sudan +249">Sudan +249</option>
                    <option value="Suriname +597">Suriname +597</option>
                    <option value="Swaziland +268">Swaziland +268</option>
                    <option value="Sweden +46">Sweden +46</option>
                    <option value="Switzerland +41">Switzerland +41</option>
                    <option value="Syria +963">Syria +963</option>
                    <option value="Taiwan +886">Taiwan +886</option>
                    <option value="Tajikistan +992">Tajikistan +992</option>
                    <option value="Tanzania +255">Tanzania +255</option>
                    <option value="Thailand +66">Thailand +66</option>
                    <option value="Thuraya (Mobile Satellite service) +88216">
                      Thuraya (Mobile Satellite service) +88216
                    </option>
                    <option value="Timor Leste +670">Timor Leste +670</option>
                    <option value="Togolese Republic +228">
                      Togolese Republic +228
                    </option>
                    <option value="Tokelau +690">Tokelau +690</option>
                    <option value="Tonga Islands +676">
                      Tonga Islands +676
                    </option>
                    <option value="Trinidad & Tobago +1-868">
                      Trinidad & Tobago +1-868
                    </option>
                    <option value="Tunisia +216">Tunisia +216</option>
                    <option value="Turkey +90">Turkey +90</option>
                    <option value="Turkmenistan +993">Turkmenistan +993</option>
                    <option value="Turks and Caicos Islands +1-649">
                      Turks and Caicos Islands +1-649
                    </option>
                    <option value="Tuvalu +688">Tuvalu +688</option>
                    <option value="Uganda +256">Uganda +256</option>
                    <option value="Ukraine +380">Ukraine +380</option>
                    <option value="United Arab Emirates +971">
                      United Arab Emirates +971
                    </option>
                    <option value="United Kingdom +44">
                      United Kingdom +44
                    </option>
                    <option value="United States of America +1">
                      United States of America +1
                    </option>
                    <option value="US Virgin Islands +1-340">
                      US Virgin Islands +1-340
                    </option>
                    <option value="Universal Personal Telecommunications (UPT) +878">
                      Universal Personal Telecommunications (UPT) +878
                    </option>
                    <option value="Uruguay +598">Uruguay +598</option>
                    <option value="Uzbekistan +998">Uzbekistan +998</option>
                    <option value="Vanuatu +678">Vanuatu +678</option>
                    <option value="Vatican City +39">Vatican City +39</option>
                    <option value="Vatican City +379">Vatican City +379</option>
                    <option value="Venezuela +58">Venezuela +58</option>
                    <option value="Vietnam +84">Vietnam +84</option>
                    <option value="Wake Island +808">Wake Island +808</option>
                    <option value="Wallis and Futuna Islands +681">
                      Wallis and Futuna Islands +681
                    </option>
                    <option value="Yemen +967">Yemen +967</option>
                    <option value="Zambia +260">Zambia +260</option>
                    <option value="Zanzibar +255">Zanzibar +255</option>
                    <option value="Zimbabwe +263">Zimbabwe +263</option>
                  </b-select>
                </b-field>
              </div>
              <div class="column is-one-third">
                <b-field label="Phone" :type="{ 'is-danger': Object.keys(phone_error).length > 0 }"
                  :message="phone_error">
                  <b-input id="phone_num_field" v-model="phone" name="phone" placeholder="912345678" pattern="[0-9]*" minlength="8"
                    maxlength="12" v-cardformat:restrictNumeric></b-input>
                  <!-- <b-input v-model="phone"
                name="phone"
                v-validate
                :message="phone_error" 
                placeholder="912345678"
                pattern="[0-9]*"
                validation-message="Enter valid 8 to 12 digits phone number"
                minlength="8" 
                maxlength="12" 
                v-cardformat:restrictNumeric
                ></b-input> -->
                </b-field>
              </div>

              <div class="column is-one-third">
                <b-field label="Email" class="input-field" :type="{ 'is-danger': Object.keys(email_error).length > 0 }"
                  :message="email_error">
                  <b-input id="email_field" name="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" maxlength="30"
                    placeholder="nobody@nowhere.com" v-model="email"></b-input>
                  <!-- <b-input
                v-validate
                :message="email_error"
                name="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                validation-message="Enter valid email address"
                maxlength="30" placeholder="nobody@nowhere.com"
                v-model="email"                
              ></b-input> -->
                </b-field>
              </div>
            </div>

            <div class="field">
              <b-field label="Special requests" :type="{
                'is-danger': Object.keys(special_requests_error).length > 0,
              }" :message="special_requests_error">
                <b-input v-model="special_requests" maxlength="500" type="textarea"
                  placeholder="We will pass on the requests to the hotel. Please note that all requests are at the hotel's discretion and not guaranteed.">
                </b-input>
              </b-field>
            </div>
          </div>

          <!-- Payment Info -->
          <div class="box">
            <h3 class="title is-3">Payment</h3>

            <div class="columns mobile">
              <div class="column is-three-fifth">
                <b-field label="Credit Card Number" class="input-field" :type="{
                  'is-danger': Object.keys(cc_number_error).length > 0,
                }" :message="cc_number_error">
                  <b-input id="cc_num_field" name="cc_number" value="" placeholder="5555-5555-5555-5555" maxlength="19"
                    v-model="cc_number" v-cardformat:formatCardNumber></b-input>
                  <!-- <b-input
                  v-validate
                  name="cc_number"
                  value="" 
                  placeholder="5555-5555-5555-5555"
                  maxlength="19"
                  minlength="16"
                  validation-message="Enter valid credit card"
                  v-model="cc_number"
                  v-cardformat:formatCardNumber                 
                ></b-input> -->
                </b-field>
              </div>
              <div class="column is-two-fifth">
                <b-field label="Name on Card" class="input-field"
                  :type="{ 'is-danger': Object.keys(cc_name_error).length > 0 }" :message="cc_name_error">
                  <b-input id="cc_name_field" value="" maxlength="30" placeholder="John Doe" v-model="cc_name"></b-input>
                </b-field>
              </div>
            </div>

            <div class="columns mobile">
              <div class="column is-one-third">
                <b-field label="Expiry date (MM / YYYY)" :type="{
                  'is-danger': Object.keys(cc_expiry_date_error).length > 0,
                }" :message="cc_expiry_date_error">
                  <b-input id="cc_expiry_date" name="cc_expiry_date" v-model="cc_expiry_date" placeholder="MM / YYYY"
                    v-cardformat:formatCardExpiry minlength="6" maxlength="9"></b-input>
                  <!-- <b-input id="cc_expiry_date" 
                      name="cc_expiry_date"
                      v-model="cc_expiry_date" placeholder="06 / 2026"
                      v-cardformat:formatCardExpiry
                      minlength="6" 
                      maxlength="9" 
                      v-validate
                      validation-message="Enter credit card expiry date in MM/YYYY format"
                      ></b-input> -->
                </b-field>
              </div>
              <div class="column is-one-third">
                <b-field label="CVV/CVC" :type="{ 'is-danger': Object.keys(cc_cvc_error).length > 0 }"
                  :message="cc_cvc_error">
                  <b-input v-model="cc_cvc" id="cvc_field" name="cc_cvc" placeholder="000" minlength="3" maxlength="3"
                    v-cardformat:restrictNumeric></b-input>
                  <!-- <b-input 
                      v-model="cc_cvc" 
                      name="cc_cvc"
                      placeholder="000"
                      :message="cc_cvc_error"
                      minlength="3" 
                      maxlength="3" 
                      v-validate
                      validation-message="Enter valid 3 digits CVV/CCVC number"
                      v-cardformat:restrictNumeric
                    ></b-input> -->
                </b-field>
              </div>
            </div>
          </div>

          <div class="box">
            <h3 class="title is-3">Billing Address</h3>

            <div class="columns mobile">
              <div class="column is-two-fifth">
                <b-field label="Country" :type="{
                  'is-danger': Object.keys(ba_country_error).length > 0,
                }" :message="ba_country_error">
                  <b-select v-model="ba_country" expanded>
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Albania">Albania</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Andorra">Andorra</option>
                    <option value="Angola">Angola</option>
                    <option value="Antigua & Deps">Antigua & Deps</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahamas">Bahamas</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Barbados">Barbados</option>
                    <option value="Belarus">Belarus</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Belize">Belize</option>
                    <option value="Benin">Benin</option>
                    <option value="Bhutan">Bhutan</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Bosnia Herzegovina">
                      Bosnia Herzegovina
                    </option>
                    <option value="Botswana">Botswana</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Brunei">Brunei</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Burkina">Burkina</option>
                    <option value="Burundi">Burundi</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Canada">Canada</option>
                    <option value="Cape Verde">Cape Verde</option>
                    <option value="Central African Rep">
                      Central African Rep
                    </option>
                    <option value="Chad">Chad</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Comoros">Comoros</option>
                    <option value="Congo">Congo</option>
                    <option value="Congo {Democratic Rep}">
                      Congo {Democratic Rep}
                    </option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Djibouti">Djibouti</option>
                    <option value="Dominica">Dominica</option>
                    <option value="Dominican Republic">
                      Dominican Republic
                    </option>
                    <option value="East Timor">East Timor</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Egypt">Egypt</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                    <option value="Eritrea">Eritrea</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Fiji">Fiji</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Gambia">Gambia</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Greece">Greece</option>
                    <option value="Grenada">Grenada</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Guinea">Guinea</option>
                    <option value="Guinea-Bissau">Guinea-Bissau</option>
                    <option value="Guyana">Guyana</option>
                    <option value="Haiti">Haiti</option>
                    <option value="Honduras">Honduras</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Iceland">Iceland</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iran">Iran</option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland {Republic}">
                      Ireland {Republic}
                    </option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Ivory Coast">Ivory Coast</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Japan">Japan</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kiribati">Kiribati</option>
                    <option value="Korea North">Korea North</option>
                    <option value="Korea South">Korea South</option>
                    <option value="Kosovo">Kosovo</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                    <option value="Laos">Laos</option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Liberia">Liberia</option>
                    <option value="Libya">Libya</option>
                    <option value="Liechtenstein">Liechtenstein</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Macedonia">Macedonia</option>
                    <option value="Madagascar">Madagascar</option>
                    <option value="Malawi">Malawi</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Mali">Mali</option>
                    <option value="Malta">Malta</option>
                    <option value="Marshall Islands">Marshall Islands</option>
                    <option value="Mauritania">Mauritania</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Micronesia">Micronesia</option>
                    <option value="Moldova">Moldova</option>
                    <option value="Monaco">Monaco</option>
                    <option value="Mongolia">Mongolia</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="Myanmar, {Burma}">Myanmar, {Burma}</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Nauru">Nauru</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Niger">Niger</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Norway">Norway</option>
                    <option value="Oman">Oman</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Palau">Palau</option>
                    <option value="Panama">Panama</option>
                    <option value="Papua New Guinea">Papua New Guinea</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Peru">Peru</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Romania">Romania</option>
                    <option value="Russian Federation">
                      Russian Federation
                    </option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="St Kitts & Nevis">St Kitts & Nevis</option>
                    <option value="St Lucia">St Lucia</option>
                    <option value="Saint Vincent & the Grenadines">
                      Saint Vincent & the Grenadines
                    </option>
                    <option value="Samoa">Samoa</option>
                    <option value="San Marino">San Marino</option>
                    <option value="Sao Tome & Principe">
                      Sao Tome & Principe
                    </option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Seychelles">Seychelles</option>
                    <option value="Sierra Leone">Sierra Leone</option>
                    <option value="Singapore" selected>Singapore</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="Solomon Islands">Solomon Islands</option>
                    <option value="Somalia">Somalia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Sudan">South Sudan</option>
                    <option value="Spain">Spain</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Sudan">Sudan</option>
                    <option value="Suriname">Suriname</option>
                    <option value="Swaziland">Swaziland</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Syria">Syria</option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="Tajikistan">Tajikistan</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Togo">Togo</option>
                    <option value="Tonga">Tonga</option>
                    <option value="Trinidad & Tobago">Trinidad & Tobago</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Turkmenistan">Turkmenistan</option>
                    <option value="Tuvalu">Tuvalu</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="United Arab Emirates">
                      United Arab Emirates
                    </option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Uzbekistan">Uzbekistan</option>
                    <option value="Vanuatu">Vanuatu</option>
                    <option value="Vatican City">Vatican City</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                  </b-select>
                </b-field>
              </div>

              <div class="column is-two-fifth">
                <b-field label="City" class="input-field" :type="{ 'is-danger': Object.keys(ba_city_error).length > 0 }"
                  :message="ba_city_error">
                  <b-input id="city_field" value="" maxlength="30" placeholder="Singapore" v-model="ba_city"></b-input>
                </b-field>
              </div>
            </div>

            <div class="columns mobile">
              <div class="column is-two-third">
                <b-field label="Billing Address" :type="{
                  'is-danger': Object.keys(ba_address_error).length > 0,
                }" :message="ba_address_error">
                  <b-input id="address_field" v-model="ba_address" placeholder="Blk 100 Hougang Ave 3 #10-10"></b-input>
                </b-field>
              </div>

              <div class="column is-one-third">
                <b-field label="Postal code" :type="{
                  'is-danger': Object.keys(ba_postal_code_error).length > 0,
                }" :message="ba_postal_code_error">
                  <b-input id="postal_field" v-model="ba_postal_code" name="ba_postal_code" placeholder="111111" minlength="5"
                    maxlength="6" v-cardformat:restrictNumeric></b-input>
                  <!-- <b-input 
                    v-model="ba_postal_code"
                    name="ba_postal_code"
                    placeholder="111111"
                    :message="ba_postal_code_error"
                    minlength="5" 
                    maxlength="6" 
                    v-validate
                    validation-message="Enter valid 6 digits postal code or valid 5 digits zip code (US)"
                    v-cardformat:restrictNumeric></b-input> -->
                </b-field>
              </div>
            </div>
          </div>

          <!-- Checkbox-->
          <div class="">
            <b-field :type="{
              'is-danger': Object.keys(termsCheckBoxGroup_error).length > 0,
            }">
              <b-checkbox id="checkbox" v-model="termsCheckBoxGroup" native-value="true" :message="termsCheckBoxGroup_error">
                I've read the terms and conditions
              </b-checkbox>
            </b-field>
          </div>

          <b-message type="is-danger" has-icon style="white-space: pre-line" v-show="other_errors !== ''">{{
              other_errors
          }}</b-message>

          <div class="center">
            <b-button id="booking_button" class="button is-primary bigbutton" @click="makeBooking()" :disabled="pending || !allow_booking">
              Confirm Booking</b-button>
          </div>
        </form>
      </div>

      <!-- Summary of selected hotel & room -->
      <div class="column is-one-third">
        <div class="box">
          <h3 class="title is-4">Summary</h3>
          <p><b>Hotel</b>: {{ hotel_name }}</p>
          <p><b>Location</b>: {{ destination_region }}</p>
          <p><b>Room Type</b>: {{ room_type }}</p>
          <p><b>Number of Rooms</b>: {{ number_of_rooms }}</p>
          <p><b>Number of Guests per Room</b>: {{ number_of_guests }}</p>
          <p><b>Check In Date</b>: {{ check_in_date }}</p>
          <p><b>Check Out Date</b>: {{ check_out_date }}</p>
          <p><b>Total Cost</b>: SGD ${{ total_cost }}</p>
        </div>
      </div>
    </div>

    <div class="columns is-mobile" v-show="display_no_data_error">
      <div class="column is-two-third" id="booking">
        <div class="card">
          <div class="card-content">
            <b-message type="is-danger" has-icon style="white-space: pre-line">
              Please select hotel destination and room before booking!
            </b-message>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthRequester from "@/AuthRequester";
import sleep from "await-sleep";
import axios from "axios";
import router from "../router";

export default {
  name: "Booking",
  data() {
    return {
      primaryGuestRadioButton: "Nope",
      countryCodeSelect: "Singapore +65",
      title: "MR",
      ba_country: "Singapore",
      all_key_info_exists: false,
      display_no_data_error: false,

      destination_id: "my_dest_id", //this.destination_id,
      destination_region: "my_destination_region", //display only
      hotel_id: "my_hotel_id", //this.hotel_id,
      hotel_name: "my_hotel_name", //display only
      room_id: "my_room_id", //this.room_id,
      room_type: "my_room_type", //display only
      booking_id: "",
      check_in_date: "2022-01-01", //this.check_in_date,
      check_out_date: "2022-01-31", //this.check_out_date,
      number_of_rooms: 0, //this.number_of_rooms,
      number_of_guests: 0, //this.number_of_guests,
      total_cost: 0, //this.total_cost,

      special_requests: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      //countryCodeSelect: "",,
      //primary_guest_passport_number: "",
      //primary_guest_passport_country: "",

      cc_name: "",
      cc_number: "",
      cc_expiry_date: "",
      cc_cvc: "",
      ba_address: "",
      //ba_country: "",
      ba_city: "",
      ba_postal_code: "",

      termsCheckBoxGroup: "",

      temp_expiry_date_str: "",

      first_name_error: {},
      last_name_error: {},
      email_error: {},
      phone_error: {},
      title_error: {},
      countryCodeSelect_error: {},
      special_requests_error: {},
      cc_number_error: "",
      cc_expiry_date_error: {},
      cc_cvc_error: {},
      cc_name_error: {},
      ba_country_error: {},
      ba_city_error: {},
      ba_address_error: {},
      ba_postal_code_error: {},
      termsCheckBoxGroup_error: {},
      other_errors: "",

      hasError: false,
      // used to check if form is being processed
      pending: false,
    };
  },
  mounted() {

    const self = this;
    self.is_mounted = true;

    (async () => {
      while (self.is_mounted) {
        await sleep(1000);
        if (!self.$store.getters.authenticated) {
          // if login credentials are removed from store
          // logout the user from profile page
          self.logout();
          break;
        }
      }
    })();


    window.scrollTo({ top: 0, behavior: "auto" });

    this.hotel_name = this.$store.state.Store.hotelName;
    this.room_type = this.$store.state.Store.roomName;
    this.destination_region = this.$store.state.Store.destination;
    this.check_in_date = this.$store.state.Store.checkindate;
    this.check_out_date = this.$store.state.Store.checkoutdate;
    this.number_of_rooms = this.$store.state.Store.numrooms;
    this.number_of_guests = this.$store.state.Store.numguests;
    this.total_cost = this.$store.state.Store.roomprice * this.number_of_rooms;
    this.destination_id = this.$store.state.Store.destid;
    this.hotel_id = this.$store.state.Store.hotelId;

    if (
      !this.hotel_id ||
      !this.destination_id ||
      !this.number_of_rooms ||
      !this.check_in_date ||
      !this.check_out_date ||
      !this.number_of_guests ||
      !this.total_cost ||
      !this.room_type
    ) {
      //display error
      this.all_key_info_exists = false;
      this.display_no_data_error = true;
      self.logout();
    } else {
      //show form
      this.all_key_info_exists = true;
    }
  },
  methods: {
    makeBooking: function (e) {
      const self = this;
      self.pending = true;
      self.other_errors = "";

      const requester = new AuthRequester(self);
      requester
        .refresh()
        .then((refresh_success) => {
          if (!refresh_success) {
            var myerr = new Error("Unable to refresh authentication");
            myerr.message = "Unable to refresh authentication";
            throw myerr;
          }
          requester.load_credentials();
          self.makeBookingPostReq(requester);
        })
        .catch((requester_error) => {
          let errors;
          if (requester_error.hasOwnProperty("response")) {
            errors = requester_error.response.data;
          } else {
            errors = undefined;
          }
          const other_errors = [];
          if (errors === undefined) {
            other_errors.push(requester_error.message);
            errors = [];
          }
          console.error("ERRORS", errors);

          for (let cause in errors) {
            // only go through errors not covered already
            if (formdata.hasOwnProperty(cause)) {
              continue;
            }
            const reasons = errors[cause];
            if (reasons instanceof Array) {
              other_errors.push(...errors[cause]);
            } else {
              other_errors.push(errors[cause]);
            }
          }

          self.other_errors = other_errors.join("\n");
          self.hasError = true;
        })
        .finally(() => {
          self.pending = false;
          //console.log('RESPIBSE', response);
        });
    },

    makeBookingPostReq(requester) {
      const self = this;
      // format_data = "%d/%m/%y",
      this.temp_expiry_date_str = this.cc_expiry_date;
      this.temp_expiry_date_str =
        "01" + this.temp_expiry_date_str.replace(/\s/g, "").replace(/\//g, "");
      this.temp_expiry_date_str =
        this.temp_expiry_date_str.substring(4, 8) +
        "-" +
        this.temp_expiry_date_str.substring(2, 4) +
        "-" +
        this.temp_expiry_date_str.substring(0, 2);
      const formdata = {
        destination_id: this.destination_id,
        hotel_id: this.hotel_id,
        room_type_id: this.room_id,

        destination_region: this.destination_region,
        hotel_name: this.hotel_name,
        room_type: this.room_type,

        booking_id: "", //generated_in_backend
        check_in_date: this.check_in_date,
        check_out_date: this.check_out_date,
        cost_in_sgd: this.total_cost, //will be recalculated_in_backend
        number_of_rooms: this.number_of_rooms,
        number_of_guests_per_rooms: this.number_of_guests,

        special_request: this.special_requests,
        primary_guest_title: this.title,
        primary_guest_first_name: this.first_name,
        primary_guest_last_name: this.last_name,
        primary_guest_email: this.email,
        primary_guest_phone: this.phone,
        primary_guest_phone_country: this.countryCodeSelect,
        did_primary_guest_accept_tnc: this.termsCheckBoxGroup,
        name_on_card: this.cc_name,
        card_number: this.cc_number,

        expiry_date: this.temp_expiry_date_str,
        security_code: this.cc_cvc,
        billing_address_address: this.ba_address,
        billing_address_country: this.ba_country,
        billing_address_city: this.ba_city,
        billing_address_post_code: this.ba_postal_code,
      };

      console.log("formdata", formdata);

      (self.first_name_error = {}),
        (self.last_name_error = {}),
        (self.email_error = {}),
        (self.phone_error = {}),
        (self.title_error = {}),
        (self.countryCodeSelect_error = {}),
        (self.special_requests_error = {}),
        (self.cc_number_error = {}),
        (self.cc_expiry_date_error = {}),
        (self.cc_cvc_error = {}),
        (self.cc_name_error = {}),
        (self.ba_country_error = {}),
        (self.ba_city_error = {}),
        (self.ba_address_error = {}),
        (self.ba_postal_code_error = {}),
        (self.termsCheckBoxGroup_error = {}),
        (self.other_errors = ""),
        (self.hasError = false);


      let responseBooking;
      (async () => {
        console.log('BOOKING REQ START')
        try {
          responseBooking = await requester.post("booking/", formdata)
          self.load_success = true
        } catch (error) {
          console.log("error", error)
          let errors = error.response.data;
          const other_errors = [];
          other_errors.push(
            "Please resolve errors in this form before proceeding!"
          );

          if (errors === undefined) {
            other_errors.push(err_resp.message);
            errors = [];
          }

          if (errors.hasOwnProperty("destination_region")) {
            other_errors.push(errors["destination_region"]);
          }
          if (errors.hasOwnProperty("hotel_name")) {
            other_errors.push(errors["hotel_name"]);
          }
          if (errors.hasOwnProperty("room_type")) {
            other_errors.push(errors["room_type"]);
          }

          if (errors.hasOwnProperty("destination_id")) {
            other_errors.push(errors["destination_id"]);
          }
          if (errors.hasOwnProperty("hotel_id")) {
            other_errors.push(errors["hotel_id"]);
          }
          if (errors.hasOwnProperty("room_type_id")) {
            other_errors.push(errors["room_type_id"]);
          }
          if (errors.hasOwnProperty("booking_id")) {
            other_errors.push(errors["booking_id"]);
          }
          if (errors.hasOwnProperty("check_in_date")) {
            other_errors.push(errors["check_in_date"]);
          }
          if (errors.hasOwnProperty("check_out_date")) {
            other_errors.push(errors["check_out_date"]);
          }
          if (errors.hasOwnProperty("number_of_rooms")) {
            other_errors.push(errors["number_of_rooms"]);
          }
          if (errors.hasOwnProperty("number_of_guests_per_rooms")) {
            other_errors.push(errors["number_of_guests_per_rooms"]);
          }
          if (errors.hasOwnProperty("cost_in_sgd")) {
            other_errors.push(errors["cost_in_sgd"]);
          }
          if (errors.hasOwnProperty("did_primary_guest_accept_tnc")) {
            other_errors.push(
              "Please read and accept the the terms and conditions"
            );
          }

          if (errors.hasOwnProperty("primary_guest_first_name")) {
            self.first_name_error = errors["primary_guest_first_name"];
          }
          if (errors.hasOwnProperty("primary_guest_last_name")) {
            self.last_name_error = errors["primary_guest_last_name"];
          }
          if (errors.hasOwnProperty("primary_guest_email")) {
            self.email_error = errors["primary_guest_email"];
          }
          if (errors.hasOwnProperty("primary_guest_phone")) {
            self.phone_error = errors["primary_guest_phone"];
          }
          if (errors.hasOwnProperty("primary_guest_title")) {
            self.title_error = errors["primary_guest_title"];
          }
          if (errors.hasOwnProperty("primary_guest_phone_country")) {
            self.countryCodeSelect_error =
              errors["primary_guest_phone_country"];
          }
          if (errors.hasOwnProperty("special_request")) {
            self.special_requests_error = errors["special_request"];
          }
          if (errors.hasOwnProperty("card_number")) {
            self.cc_number_error = errors["card_number"];
          }
          if (errors.hasOwnProperty("expiry_date")) {
            self.cc_expiry_date_error = errors["expiry_date"];
          }
          if (errors.hasOwnProperty("security_code")) {
            self.cc_cvc_error = errors["security_code"];
          }
          if (errors.hasOwnProperty("name_on_card")) {
            self.cc_name_error = errors["name_on_card"];
          }
          if (errors.hasOwnProperty("billing_address_country")) {
            self.ba_country_error = errors["billing_address_country"];
          }
          if (errors.hasOwnProperty("billing_address_city")) {
            self.ba_city_error = errors["billing_address_city"];
          }
          if (errors.hasOwnProperty("billing_address_address")) {
            self.ba_address_error = errors["billing_address_address"];
          }
          if (errors.hasOwnProperty("billing_address_post_code")) {
            self.ba_postal_code_error = errors["billing_address_post_code"];
          }

          console.error("ERRORS", errors);

          for (let cause in errors) {
            // only go through errors not covered already
            if (formdata.hasOwnProperty(cause)) {
              continue;
            }
            const reasons = errors[cause];
            if (reasons instanceof Array) {
              other_errors.push(...errors[cause]);
            } else {
              other_errors.push(errors[cause]);
            }
          }

          self.other_errors = other_errors.join("\n");
          self.hasError = true;
        }
        finally {
          self.pending = false;
        }

        if (!self.load_success) {
          self.load_success = false
          return false;
        }

        console.log("success!");

        let toast_type, message;
        const status_code = responseBooking.status;
        toast_type = "is-dark";
        message = "booking was made succesfully";

        this.$buefy.toast.open({
          duration: 5000,
          message: message,
          type: toast_type,
          pauseOnHover: true,
        });

        // redirect to booking history page
        router.push("/bookinghistory");


      })();

    },

    logout(toast = false) {
      const self = this;

      if (toast) {
        self.$buefy.toast.open({
          duration: 5000,
          message: `User not logged in`,
          type: "is-danger",
          pauseOnHover: true,
        });
      }

      self.status_text = "login required";
      self.load_success = false;
      self.first_name = null;
      self.last_name = null;
      self.email = null;
      router.push("/");
    },
  },
  computed: {
    allow_booking() {
      return (
        this.first_name.trim() !== "" &&
        this.last_name.trim() !== "" &&
        this.email.trim() !== "" &&
        this.phone.trim() !== "" &&
        this.cc_name.trim() !== "" &&
        this.cc_number.trim() !== "" &&
        this.cc_expiry_date.trim() !== "" &&
        this.cc_cvc.trim() !== "" &&
        this.ba_address.trim() !== "" &&
        this.ba_city.trim() !== "" &&
        this.ba_postal_code.trim() !== "" &&
        this.termsCheckBoxGroup == true
      );
    },
  },
};
</script>


<style lang="scss" scoped>
.bigbutton {
  align-self: center;
  padding: 20px 32px;
  text-align: center;
  font-size: 25px;
  margin-top: 10px;
  margin-bottom: 60px;
}

.center {
  align-self: center;
  text-align: center;
}
</style>
